/**
 * Metro configuration for Capire-app
 *
 * Overrides:
 * - resolver.extraNodeModules: Adds '@' alias pointing to src/ for absolute imports
 * - watchFolders: Includes src/ in Metros watcher to restart bundler on changes there
 * - withNativeWind: Configures NativeWind Tailwind CSS integration with global.css as input
 */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src')
};

config.watchFolders = [path.resolve(__dirname, 'src')];

module.exports = withNativeWind(config, { input: './global.css' });
