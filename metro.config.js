const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

config.transformer.babelTransformerPath =
  require.resolve('react-native-svg-transformer');

// Kysely's FileMigrationProvider uses a dynamic `import(/* webpackIgnore */ ...)`
// that Hermes fails to parse in release bundles. Stub it — not usable in RN anyway.
const kyselyFileMigrationShim = path.resolve(
  __dirname,
  'metro.shims/kysely-file-migration-provider.js',
);
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (/(^|\/)file-migration-provider(\.js)?$/.test(moduleName)) {
    return { type: 'sourceFile', filePath: kyselyFileMigrationShim };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
