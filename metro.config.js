const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Keep wasm resolvable if something still pulls expo-sqlite on web.
config.resolver.assetExts.push('wasm');

module.exports = config;
