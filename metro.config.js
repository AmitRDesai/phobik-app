const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

config.transformer.babelTransformerPath =
  require.resolve('react-native-svg-transformer');

// Kysely's FileMigrationProvider uses a dynamic `import()` with a runtime
// expression, which Hermes can't parse in release bundles. The app never
// runs migrations on-device, so stub the module out.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (/migration\/file-migration-provider(\.js)?$/.test(moduleName)) {
    return { type: 'empty' };
  }
  return (originalResolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform,
  );
};

module.exports = withNativeWind(config, { input: './global.css' });
