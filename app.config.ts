import type { ConfigContext, ExpoConfig } from 'expo/config';

type Variant = 'development' | 'preview' | 'production';

const VARIANTS: Record<
  Variant,
  { name: string; bundleId: string; scheme: string }
> = {
  development: {
    name: 'Phobik Dev',
    bundleId: 'com.phobik.app.dev',
    scheme: 'phobik.dev',
  },
  preview: {
    name: 'Phobik Preview',
    bundleId: 'com.phobik.app.preview',
    scheme: 'phobik.preview',
  },
  production: {
    name: 'Phobik',
    bundleId: 'com.phobik.app',
    scheme: 'phobik',
  },
};

function resolveVariant(): Variant {
  const value = process.env.EXPO_PUBLIC_ENV;
  if (
    value === 'development' ||
    value === 'preview' ||
    value === 'production'
  ) {
    return value;
  }
  return 'production';
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, bundleId, scheme } = VARIANTS[resolveVariant()];

  return {
    ...config,
    name,
    slug: 'phobik',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme,
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        LSApplicationQueriesSchemes: ['message', 'mailto'],
      },
      appleTeamId: 'TF2K337A64',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#FF2D85',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      package: bundleId,
      permissions: [
        'android.permission.USE_BIOMETRIC',
        'android.permission.USE_FINGERPRINT',
        'android.permission.READ_CALENDAR',
        'android.permission.WRITE_CALENDAR',
        'android.permission.MODIFY_AUDIO_SETTINGS',
        'android.permission.health.READ_HEART_RATE',
        'android.permission.health.READ_HEART_RATE_VARIABILITY',
        'android.permission.health.READ_RESTING_HEART_RATE',
        'android.permission.health.READ_RESPIRATORY_RATE',
        'android.permission.health.READ_SLEEP',
      ],
      googleServicesFile: './google-services.json',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#050505',
          dark: {
            backgroundColor: '#050505',
          },
        },
      ],
      'expo-secure-store',
      'expo-notifications',
      'expo-apple-authentication',
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow Phobik to use Face ID for quick sign-in.',
        },
      ],
      [
        'expo-calendar',
        {
          calendarPermission:
            'Allow Phobik to read your calendar so we can help you prepare for stressful events.',
        },
      ],
      [
        'expo-audio',
        {
          recordAudioAndroid: false,
        },
      ],
      'expo-asset',
      'expo-sharing',
      'expo-speech-recognition',
      [
        '@kingstinct/react-native-healthkit',
        {
          NSHealthShareUsageDescription:
            'Phobik reads heart rate, HRV, resting heart rate, respiratory rate, and sleep analysis from Apple Health to show real-time stress and recovery insights.',
          NSHealthUpdateUsageDescription:
            'Phobik does not write to Apple Health.',
          background: true,
        },
      ],
      'react-native-health-connect',
      'expo-health-connect',
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 28,
            manifestQueries: {
              package: ['com.google.android.apps.healthdata'],
            },
          },
        },
      ],
      'expo-background-task',
      'expo-image',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '7164b7c9-dbdf-4e0d-ac85-fe1e20776334',
      },
    },
    owner: 'amitdesai',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/7164b7c9-dbdf-4e0d-ac85-fe1e20776334',
    },
  };
};
