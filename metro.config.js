const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Create a small mapping for @firebase scoped packages to their
// React Native build files. Metro sometimes fails to resolve the
// conditional "exports" or ESM entrypoints inside Firebase packages
// when used with Expo. Pointing the resolver to the RN-specific
// files fixes the bundling error.

const config = getDefaultConfig(__dirname);

// Ensure resolver exists
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = config.resolver.extraNodeModules || {};

const firebasePackages = [
  "@firebase/app",
  "@firebase/auth",
  "@firebase/firestore",
  "@firebase/storage",
  "@firebase/util",
  "@firebase/webchannel-wrapper",
  "@firebase/installations",
  "@firebase/analytics",
  "@firebase/performance",
  "@firebase/remote-config",
];

firebasePackages.forEach((pkg) => {
  // Map package name to the RN-specific built file if it exists
  config.resolver.extraNodeModules[pkg] = path.resolve(
    __dirname,
    "node_modules",
    pkg,
    "dist",
    "index.rn.js"
  );
});

// Some firebase packages use .cjs/.mjs; include common extensions
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes("cjs")) {
   config.resolver.sourceExts.push("cjs");
}

module.exports = config;
