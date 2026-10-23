const requireOptionalNativeModule = jest.fn((name) => {
  if (name === "ExpoMediaLibraryNext") {
    return { name };
  }
  return null;
});

const requireNativeModule = jest.fn((name) => ({ name }));

module.exports = {
  requireOptionalNativeModule,
  requireNativeModule,
};
