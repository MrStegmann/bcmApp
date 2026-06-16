const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName.startsWith('zustand')) {
    if (moduleName === 'zustand') {
      return context.resolveRequest(context, 'zustand/index.js', platform);
    }
    // Handle specific subpaths like zustand/middleware
    if (moduleName === 'zustand/middleware') {
      return context.resolveRequest(context, 'zustand/middleware.js', platform);
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./index.css" });
