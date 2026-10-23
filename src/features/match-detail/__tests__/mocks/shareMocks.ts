/**
 * Jest mock configurations for react-native-view-shot, expo-sharing, and expo-media-library
 * Feature: 012-share-match-stats
 */

declare const jest: any;

export const mockCaptureRef = jest.fn().mockResolvedValue("file:///mock/path/match-stats.png");

export const mockIsAvailableAsync = jest.fn().mockResolvedValue(true);
export const mockShareAsync = jest.fn().mockResolvedValue({});

export const mockRequestPermissionsAsync = jest.fn().mockResolvedValue({
  status: "granted",
  granted: true,
  canAskAgain: true,
  expires: "never",
});

export const mockGetPermissionsAsync = jest.fn().mockResolvedValue({
  status: "granted",
  granted: true,
  canAskAgain: true,
  expires: "never",
});

export const mockSaveToLibraryAsync = jest.fn().mockResolvedValue(undefined);
export const mockCreateAssetAsync = jest.fn().mockResolvedValue({ id: "mock-asset-id" });

const expoFsMock = require("../../../../__tests__/mocks/expo-file-system");
const expoCoreMock = require("../../../../__tests__/mocks/expo-modules-core");

export const mockCacheDirectory = expoFsMock.cacheDirectory;
export const mockCopyAsync = expoFsMock.copyAsync;
export const mockDeleteAsync = expoFsMock.deleteAsync;
export const mockRequireOptionalNativeModule = expoCoreMock.requireOptionalNativeModule;

export let mockMediaLibraryAvailable = true;

export function setMediaLibraryAvailable(available: boolean) {
  mockMediaLibraryAvailable = available;
}

export const mockMediaLibraryModule = {
  get getPermissionsAsync() {
    return mockMediaLibraryAvailable ? ((...args: any[]) => mockGetPermissionsAsync(...args)) : undefined;
  },
  get requestPermissionsAsync() {
    return mockMediaLibraryAvailable ? ((...args: any[]) => mockRequestPermissionsAsync(...args)) : undefined;
  },
  get saveToLibraryAsync() {
    return mockMediaLibraryAvailable ? ((...args: any[]) => mockSaveToLibraryAsync(...args)) : undefined;
  },
  get createAssetAsync() {
    return mockMediaLibraryAvailable ? ((...args: any[]) => mockCreateAssetAsync(...args)) : undefined;
  },
};

/**
 * Helper to setup all default share mocks in Jest
 */
export function setupShareMocks() {
  jest.mock("react-native-view-shot", () => ({
    captureRef: mockCaptureRef,
    default: "ViewShot",
  }));

  jest.mock("expo-sharing", () => ({
    isAvailableAsync: mockIsAvailableAsync,
    shareAsync: mockShareAsync,
  }));

  jest.mock("expo-media-library", () => mockMediaLibraryModule);
}

/**
 * Reset all share mocks to default successful states
 */
export function resetShareMocks() {
  mockMediaLibraryAvailable = true;
  mockCaptureRef.mockReset().mockResolvedValue("file:///mock/path/match-stats.png");
  mockIsAvailableAsync.mockReset().mockResolvedValue(true);
  mockShareAsync.mockReset().mockResolvedValue({});
  mockRequestPermissionsAsync.mockReset().mockResolvedValue({
    status: "granted",
    granted: true,
    canAskAgain: true,
    expires: "never",
  });
  mockGetPermissionsAsync.mockReset().mockResolvedValue({
    status: "granted",
    granted: true,
    canAskAgain: true,
    expires: "never",
  });
  mockSaveToLibraryAsync.mockReset().mockResolvedValue(undefined);
  mockCreateAssetAsync.mockReset().mockResolvedValue({ id: "mock-asset-id" });
  mockCopyAsync.mockReset().mockResolvedValue(undefined);
  mockDeleteAsync.mockReset().mockResolvedValue(undefined);
  mockRequireOptionalNativeModule.mockReset().mockImplementation((moduleName: string) => {
    if (mockMediaLibraryAvailable && moduleName === "ExpoMediaLibraryNext") {
      return { name: moduleName };
    }
    return null;
  });
}
