import {
  matchShareService,
  isMediaLibraryAvailable,
  getMediaLibraryModule,
} from "../../services/matchShareService";
import {
  mockCaptureRef,
  mockIsAvailableAsync,
  mockShareAsync,
  mockGetPermissionsAsync,
  mockRequestPermissionsAsync,
  mockSaveToLibraryAsync,
  mockMediaLibraryModule,
  mockCopyAsync,
  mockDeleteAsync,
  mockCacheDirectory,
  mockRequireOptionalNativeModule,
  setMediaLibraryAvailable,
  resetShareMocks,
} from "../mocks/shareMocks";

declare const jest: any;

jest.mock("react-native-view-shot", () => ({
  captureRef: (...args: any[]) => mockCaptureRef(...args),
}));

jest.mock("expo-sharing", () => ({
  isAvailableAsync: (...args: any[]) => mockIsAvailableAsync(...args),
  shareAsync: (...args: any[]) => mockShareAsync(...args),
}));

jest.mock("expo-media-library", () => mockMediaLibraryModule);

describe("matchShareService Unit Tests (T017 - US3)", () => {
  beforeEach(() => {
    resetShareMocks();
  });

  describe("Native Module Guard (ExpoMediaLibraryNext)", () => {
    it("should return false and getMediaLibraryModule() should return null without throwing when native module is missing", () => {
      mockRequireOptionalNativeModule.mockReturnValue(null);

      expect(isMediaLibraryAvailable()).toBe(false);
      expect(getMediaLibraryModule()).toBeNull();
    });

    it("should return false and getMediaLibraryModule() should return null when only legacy ExpoMediaLibrary is present (preventing false positive in Expo Go)", () => {
      mockRequireOptionalNativeModule.mockImplementation((name: string) =>
        name === "ExpoMediaLibrary" ? { name } : null
      );

      expect(isMediaLibraryAvailable()).toBe(false);
      expect(getMediaLibraryModule()).toBeNull();
    });

    it("should return false when globalThis.expo.modules only contains legacy ExpoMediaLibrary", () => {
      mockRequireOptionalNativeModule.mockReturnValue(null);
      const originalExpo = (globalThis as any).expo;
      try {
        (globalThis as any).expo = { modules: { ExpoMediaLibrary: {} } };
        expect(isMediaLibraryAvailable()).toBe(false);
      } finally {
        (globalThis as any).expo = originalExpo;
      }
    });

    it("should return true when globalThis.expo.modules contains ExpoMediaLibraryNext", () => {
      mockRequireOptionalNativeModule.mockReturnValue(null);
      const originalExpo = (globalThis as any).expo;
      try {
        (globalThis as any).expo = { modules: { ExpoMediaLibraryNext: {} } };
        expect(isMediaLibraryAvailable()).toBe(true);
      } finally {
        (globalThis as any).expo = originalExpo;
      }
    });

    it("should return true and getMediaLibraryModule() should return module when native module is present", () => {
      mockRequireOptionalNativeModule.mockImplementation((name: string) =>
        name === "ExpoMediaLibraryNext" ? { name } : null
      );

      expect(isMediaLibraryAvailable()).toBe(true);
      expect(getMediaLibraryModule()).toBeDefined();
    });
  });

  describe("captureViewToPng", () => {
    it("should capture ref and return file URI when view ref is valid", async () => {
      const mockRef = { current: { setNativeProps: jest.fn() } };
      mockCaptureRef.mockResolvedValue("file:///tmp/boxscore.png");

      const uri = await matchShareService.captureViewToPng(mockRef as any);

      expect(mockCaptureRef).toHaveBeenCalledWith(mockRef, {
        format: "png",
        quality: 1.0,
        result: "tmpfile",
      });
      expect(uri).toBe("file:///tmp/boxscore.png");
    });

    it("should capture and copy image to custom formatted filename when customFileName is provided", async () => {
      const mockRef = { current: { setNativeProps: jest.fn() } };
      mockCaptureRef.mockResolvedValue("file:///tmp/raw_capture.png");

      const uri = await matchShareService.captureViewToPng(
        mockRef as any,
        "CB_Granollers_Jornada_4.png"
      );

      expect(mockCaptureRef).toHaveBeenCalledWith(mockRef, {
        format: "png",
        quality: 1.0,
        result: "tmpfile",
        fileName: "CB_Granollers_Jornada_4",
      });
      expect(mockCopyAsync).toHaveBeenCalledWith({
        from: "file:///tmp/raw_capture.png",
        to: "file:///mock/cache/CB_Granollers_Jornada_4.png",
      });
      expect(uri).toBe("file:///mock/cache/CB_Granollers_Jornada_4.png");
    });

    it("should throw error if view ref is null or ref.current is missing", async () => {
      let thrownError: any = null;
      try {
        await matchShareService.captureViewToPng({ current: null } as any);
      } catch (err) {
        thrownError = err;
      }
      expect(thrownError).toBeDefined();
      expect(thrownError.message).toContain("No view ref provided for capture");
    });
  });

  describe("shareImageFile", () => {
    it("should dispatch native sharing if sharing is available", async () => {
      mockIsAvailableAsync.mockResolvedValue(true);
      mockShareAsync.mockResolvedValue({});

      const outcome = await matchShareService.shareImageFile("file:///tmp/boxscore.png", "Custom Title");

      expect(mockIsAvailableAsync).toHaveBeenCalled();
      expect(mockShareAsync).toHaveBeenCalledWith("file:///tmp/boxscore.png", {
        mimeType: "image/png",
        dialogTitle: "Custom Title",
        UTI: "public.png",
      });
      expect(outcome.success).toBe(true);
    });

    it("should return failure if sharing is not available on device", async () => {
      mockIsAvailableAsync.mockResolvedValue(false);

      const outcome = await matchShareService.shareImageFile("file:///tmp/boxscore.png");

      expect(mockShareAsync).not.toHaveBeenCalled();
      expect(outcome.success).toBe(false);
      expect((outcome as any).error).toContain("no está disponible");
    });

    it("should handle exceptions thrown by shareAsync gracefully", async () => {
      mockIsAvailableAsync.mockResolvedValue(true);
      mockShareAsync.mockRejectedValue(new Error("Sharing failed"));

      const outcome = await matchShareService.shareImageFile("file:///tmp/boxscore.png");

      expect(outcome.success).toBe(false);
      expect((outcome as any).error).toBe("Sharing failed");
    });

    it("should copy to custom filename before sharing if customFileName is provided", async () => {
      mockIsAvailableAsync.mockResolvedValue(true);
      mockShareAsync.mockResolvedValue({});

      const outcome = await matchShareService.shareImageFile(
        "file:///tmp/raw_boxscore.png",
        "Compartir estadísticas",
        "CB_Granollers_Jornada_4.png"
      );

      expect(mockCopyAsync).toHaveBeenCalledWith({
        from: "file:///tmp/raw_boxscore.png",
        to: "file:///mock/cache/CB_Granollers_Jornada_4.png",
      });
      expect(mockShareAsync).toHaveBeenCalledWith(
        "file:///mock/cache/CB_Granollers_Jornada_4.png",
        expect.objectContaining({ mimeType: "image/png" })
      );
      expect(outcome.success).toBe(true);
    });
  });

  describe("saveImageToGallery", () => {
    it("should save file to library when permissions are already granted", async () => {
      mockGetPermissionsAsync.mockResolvedValue({ granted: true, status: "granted" });
      mockSaveToLibraryAsync.mockResolvedValue(undefined);

      const outcome = await matchShareService.saveImageToGallery("file:///tmp/boxscore.png");

      expect(mockGetPermissionsAsync).toHaveBeenCalled();
      expect(mockSaveToLibraryAsync).toHaveBeenCalledWith("file:///tmp/boxscore.png");
      expect(outcome.success).toBe(true);
    });

    it("should copy file to custom filename before saving to gallery if customFileName is provided", async () => {
      mockGetPermissionsAsync.mockResolvedValue({ granted: true, status: "granted" });
      mockSaveToLibraryAsync.mockResolvedValue(undefined);

      const outcome = await matchShareService.saveImageToGallery(
        "file:///tmp/raw_boxscore.png",
        "CB_Granollers_Jornada_4.png"
      );

      expect(mockCopyAsync).toHaveBeenCalledWith({
        from: "file:///tmp/raw_boxscore.png",
        to: "file:///mock/cache/CB_Granollers_Jornada_4.png",
      });
      expect(mockSaveToLibraryAsync).toHaveBeenCalledWith("file:///mock/cache/CB_Granollers_Jornada_4.png");
      expect(outcome.success).toBe(true);
    });

    it("should gracefully fallback to expo-sharing when native module is missing from runtime (Expo Go)", async () => {
      mockRequireOptionalNativeModule.mockReturnValue(null);
      mockIsAvailableAsync.mockResolvedValue(true);
      mockShareAsync.mockResolvedValue({});

      const outcome = await matchShareService.saveImageToGallery("file:///mock/cache/CB_Granollers_Jornada_4.png");

      expect(mockGetPermissionsAsync).not.toHaveBeenCalled();
      expect(mockShareAsync).toHaveBeenCalledWith("file:///mock/cache/CB_Granollers_Jornada_4.png", {
        mimeType: "image/png",
        dialogTitle: "Guardar o compartir imagen",
        UTI: "public.png",
      });
      expect(outcome.success).toBe(true);
      expect((outcome as any).message).toContain("Guardado directo no disponible en este entorno");
    });

    it("should gracefully fallback to expo-sharing when only legacy ExpoMediaLibrary is present in runtime (Expo Go)", async () => {
      mockRequireOptionalNativeModule.mockImplementation((name: string) =>
        name === "ExpoMediaLibrary" ? { name } : null
      );
      mockIsAvailableAsync.mockResolvedValue(true);
      mockShareAsync.mockResolvedValue({});

      const outcome = await matchShareService.saveImageToGallery("file:///mock/cache/CB_Granollers_Jornada_4.png");

      expect(mockGetPermissionsAsync).not.toHaveBeenCalled();
      expect(mockShareAsync).toHaveBeenCalledWith("file:///mock/cache/CB_Granollers_Jornada_4.png", {
        mimeType: "image/png",
        dialogTitle: "Guardar o compartir imagen",
        UTI: "public.png",
      });
      expect(outcome.success).toBe(true);
      expect((outcome as any).message).toContain("Guardado directo no disponible en este entorno");
    });

    it("should request permissions when not initially granted and save if user approves", async () => {
      mockGetPermissionsAsync.mockResolvedValue({ granted: false, status: "undetermined" });
      mockRequestPermissionsAsync.mockResolvedValue({ granted: true, status: "granted" });
      mockSaveToLibraryAsync.mockResolvedValue(undefined);

      const outcome = await matchShareService.saveImageToGallery("file:///tmp/boxscore.png");

      expect(mockRequestPermissionsAsync).toHaveBeenCalled();
      expect(mockSaveToLibraryAsync).toHaveBeenCalledWith("file:///tmp/boxscore.png");
      expect(outcome.success).toBe(true);
    });

    it("should return permissionDenied failure when user denies permissions", async () => {
      mockGetPermissionsAsync.mockResolvedValue({ granted: false, status: "denied" });
      mockRequestPermissionsAsync.mockResolvedValue({ granted: false, status: "denied" });

      const outcome = await matchShareService.saveImageToGallery("file:///tmp/boxscore.png");

      expect(mockSaveToLibraryAsync).not.toHaveBeenCalled();
      expect(outcome.success).toBe(false);
      expect((outcome as any).permissionDenied).toBe(true);
    });

    it("should gracefully fallback to expo-sharing when expo-media-library is unavailable", async () => {
      setMediaLibraryAvailable(false);
      mockIsAvailableAsync.mockResolvedValue(true);
      mockShareAsync.mockResolvedValue({});

      const outcome = await matchShareService.saveImageToGallery("file:///tmp/boxscore.png");

      expect(mockIsAvailableAsync).toHaveBeenCalled();
      expect(mockShareAsync).toHaveBeenCalledWith("file:///tmp/boxscore.png", {
        mimeType: "image/png",
        dialogTitle: "Guardar o compartir imagen",
        UTI: "public.png",
      });
      expect(outcome.success).toBe(true);
      expect((outcome as any).message).toContain("Guardado directo no disponible");
    });

    it("should return error if expo-media-library is unavailable and sharing is also unavailable", async () => {
      setMediaLibraryAvailable(false);
      mockIsAvailableAsync.mockResolvedValue(false);

      const outcome = await matchShareService.saveImageToGallery("file:///tmp/boxscore.png");

      expect(outcome.success).toBe(false);
      expect((outcome as any).error).toContain("no disponible en este dispositivo");
    });

    it("should gracefully fallback to sharing if native module throws Cannot find native module error", async () => {
      mockGetPermissionsAsync.mockRejectedValue(
        new Error("Cannot find native module 'ExpoMediaLibraryNext'")
      );
      mockIsAvailableAsync.mockResolvedValue(true);
      mockShareAsync.mockResolvedValue({});

      const outcome = await matchShareService.saveImageToGallery("file:///tmp/boxscore.png");

      expect(mockShareAsync).toHaveBeenCalled();
      expect(outcome.success).toBe(true);
      expect((outcome as any).message).toContain("Guardado directo no disponible");
    });

    it("should handle unexpected error when sharing fallback also fails", async () => {
      mockGetPermissionsAsync.mockResolvedValue({ granted: true, status: "granted" });
      mockSaveToLibraryAsync.mockRejectedValue(new Error("Disk full"));
      mockIsAvailableAsync.mockResolvedValue(false);

      const outcome = await matchShareService.saveImageToGallery("file:///tmp/boxscore.png");

      expect(outcome.success).toBe(false);
      expect((outcome as any).error).toBe("Disk full");
    });
  });
});
