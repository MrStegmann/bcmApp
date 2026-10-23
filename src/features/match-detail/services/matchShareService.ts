import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { requireOptionalNativeModule } from "expo-modules-core";
import { MatchShareServiceContract, ShareActionOutcome } from "../types";

/**
 * Safely verifies if the native media library module (ExpoMediaLibraryNext)
 * is registered in the current runtime WITHOUT calling require("expo-media-library").
 *
 * Note: expo-media-library v57 exclusively imports and delegates to ExpoMediaLibraryNext.
 * In Expo Go, legacy ExpoMediaLibrary is present while ExpoMediaLibraryNext is not;
 * checking ExpoMediaLibrary produces a false positive that causes require("expo-media-library")
 * to trigger an uncatchable fatal RedBox crash via Metro's guardedLoadModule.
 */
export function isMediaLibraryAvailable(): boolean {
  try {
    const nativeModule =
      (typeof requireOptionalNativeModule === "function"
        ? requireOptionalNativeModule("ExpoMediaLibraryNext")
        : null) ??
      (globalThis as any).expo?.modules?.ExpoMediaLibraryNext;

    return !!nativeModule;
  } catch {
    return false;
  }
}

/**
 * Safely resolves expo-media-library dynamically ONLY when the native module
 * is confirmed to be available in the runtime.
 */
export function getMediaLibraryModule(): any {
  if (!isMediaLibraryAvailable()) {
    return null;
  }
  try {
    return require("expo-media-library");
  } catch {
    return null;
  }
}

/**
 * Ensures the given image file URI is copied to a deterministic filename in the cache directory.
 * Preserves file:// scheme and .png extension.
 */
export async function copyToNamedFile(sourceUri: string, fileName: string): Promise<string> {
  if (!fileName || !sourceUri) {
    return sourceUri;
  }

  try {
    const cacheDir = FileSystem?.cacheDirectory;
    if (!cacheDir) {
      return sourceUri;
    }

    const cleanFileName = fileName.toLowerCase().endsWith(".png") ? fileName : `${fileName}.png`;
    const targetUri = `${cacheDir}${cleanFileName}`;

    if (sourceUri === targetUri) {
      return targetUri;
    }

    if (typeof FileSystem?.deleteAsync === "function") {
      try {
        await FileSystem.deleteAsync(targetUri, { idempotent: true });
      } catch {
        // ignore delete failure
      }
    }

    if (typeof FileSystem?.copyAsync === "function") {
      await FileSystem.copyAsync({
        from: sourceUri,
        to: targetUri,
      });
      return targetUri;
    }

    return sourceUri;
  } catch (err) {
    console.warn("Failed to copy image to custom filename:", err);
    return sourceUri;
  }
}

export const matchShareService: MatchShareServiceContract = {
  /**
   * Captures the given View ref to a high-resolution PNG file.
   * If customFileName is provided, saves/copies the image using that filename.
   * @param viewRef React ref pointing to the graphic view.
   * @param customFileName Optional filename (e.g. "CB_Granollers_Jornada_4.png").
   * @returns Local file URI string (file://...)
   */
  captureViewToPng: async (
    viewRef: React.RefObject<any>,
    customFileName?: string
  ): Promise<string> => {
    if (!viewRef || !viewRef.current) {
      throw new Error("No view ref provided for capture");
    }

    const baseFileName = customFileName ? customFileName.replace(/\.png$/i, "") : undefined;

    const rawUri = await captureRef(viewRef, {
      format: "png",
      quality: 1.0,
      result: "tmpfile",
      ...(baseFileName ? { fileName: baseFileName } : {}),
    });

    if (customFileName) {
      return await copyToNamedFile(rawUri, customFileName);
    }

    return rawUri;
  },

  /**
   * Shares the generated PNG file using the platform's native share sheet.
   * @param fileUri Local file URI of the PNG image.
   * @param dialogTitle Title shown in system share dialog.
   * @param customFileName Optional filename to ensure before sharing.
   */
  shareImageFile: async (
    fileUri: string,
    dialogTitle: string = "Compartir estadísticas",
    customFileName?: string
  ): Promise<ShareActionOutcome> => {
    try {
      let targetUri = fileUri;
      if (customFileName) {
        targetUri = await copyToNamedFile(fileUri, customFileName);
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        return {
          success: false,
          error: "La función de compartir no está disponible en este dispositivo.",
        };
      }

      await Sharing.shareAsync(targetUri, {
        mimeType: "image/png",
        dialogTitle,
        UTI: "public.png",
      });

      return {
        success: true,
        message: "Imagen compartida exitosamente.",
        uri: targetUri,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Error al compartir la imagen.",
      };
    }
  },

  /**
   * Saves the generated PNG file directly to the device photo library.
   * Requests user permission if not already granted.
   * If expo-media-library native module is not available in the runtime,
   * gracefully falls back to the system share sheet (Sharing.shareAsync)
   * so the user can save or share the image without an uncaught crash.
   * @param fileUri Local file URI of the PNG image.
   * @param customFileName Optional filename to ensure before saving.
   */
  saveImageToGallery: async (
    fileUri: string,
    customFileName?: string
  ): Promise<ShareActionOutcome> => {
    let targetUri = fileUri;
    if (customFileName) {
      targetUri = await copyToNamedFile(fileUri, customFileName);
    }

    try {
      const MediaLibrary = getMediaLibraryModule();

      if (!MediaLibrary || typeof MediaLibrary.getPermissionsAsync !== "function") {
        const isShareAvailable = await Sharing.isAvailableAsync();
        if (isShareAvailable) {
          await Sharing.shareAsync(targetUri, {
            mimeType: "image/png",
            dialogTitle: "Guardar o compartir imagen",
            UTI: "public.png",
          });
          return {
            success: true,
            message: "Guardado directo no disponible en este entorno. Se abrió el selector para guardar.",
            uri: targetUri,
          };
        }

        return {
          success: false,
          error: "Guardado en galería no disponible en este dispositivo.",
        };
      }

      let permission = await MediaLibrary.getPermissionsAsync();

      if (!permission.granted) {
        permission = await MediaLibrary.requestPermissionsAsync();
      }

      if (!permission.granted) {
        return {
          success: false,
          error: "Permiso denegado para acceder a la galería de fotos.",
          permissionDenied: true,
        };
      }

      if (MediaLibrary.saveToLibraryAsync) {
        await MediaLibrary.saveToLibraryAsync(targetUri);
      } else if (MediaLibrary.createAssetAsync) {
        await MediaLibrary.createAssetAsync(targetUri);
      }

      return {
        success: true,
        message: "Imagen guardada en la galería de fotos.",
        uri: targetUri,
      };
    } catch (err: any) {
      try {
        const isShareAvailable = await Sharing.isAvailableAsync();
        if (isShareAvailable) {
          await Sharing.shareAsync(targetUri, {
            mimeType: "image/png",
            dialogTitle: "Guardar o compartir imagen",
            UTI: "public.png",
          });
          return {
            success: true,
            message: "Guardado directo no disponible. Se abrió el selector para guardar.",
            uri: targetUri,
          };
        }
      } catch {
        // ignore share fallback error and return original error
      }

      return {
        success: false,
        error: err.message || "Error al guardar en la galería.",
      };
    }
  },
};
