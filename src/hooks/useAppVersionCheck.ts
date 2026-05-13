import { orpc } from '@/lib/orpc';
import { useQuery } from '@tanstack/react-query';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

export type VersionCheckResult =
  | { action: 'none' }
  | { action: 'soft-update'; storeUrl: string; latestVersion: string }
  | { action: 'force-update'; storeUrl: string; minimumVersion: string };

type SupportedPlatform = 'ios' | 'android';
type SupportedChannel = 'development' | 'preview' | 'production';

const SUPPORTED_PLATFORMS: SupportedPlatform[] = ['ios', 'android'];
const SUPPORTED_CHANNELS: SupportedChannel[] = [
  'development',
  'preview',
  'production',
];

type ParsedVersion = { major: number; minor: number; patch: number };

/**
 * Extract major/minor/patch from a loose version string. Tolerates `"1.2"`,
 * `"1"`, `"1.2.3-beta"`, prefixes like `"v1.2.3"`. Missing parts default to 0.
 * Returns null when no leading digit run is found.
 */
function parseVersion(input: string | null | undefined): ParsedVersion | null {
  if (!input) return null;
  const match = input.match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2] ?? 0),
    patch: Number(match[3] ?? 0),
  };
}

/** -1 if a<b, 0 if equal, 1 if a>b. */
function compareVersions(a: ParsedVersion, b: ParsedVersion): number {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;
  return 0;
}

function resolveChannel(): SupportedChannel {
  const ch = Updates.channel as string | null | undefined;
  if (ch && (SUPPORTED_CHANNELS as string[]).includes(ch)) {
    return ch as SupportedChannel;
  }
  return 'production';
}

function isSupportedPlatform(os: string): os is SupportedPlatform {
  return (SUPPORTED_PLATFORMS as string[]).includes(os);
}

/**
 * Polls the backend `appVersion.getAppVersion` procedure on mount and on
 * foreground, then resolves the action the app should take:
 *   - `force-update`: client below `minimumVersion` → block boot
 *   - `soft-update` : client below `latestVersion` → dismissable prompt
 *   - `none`        : client current, web platform, dev build, or check failed
 *
 * Failure modes ALWAYS resolve to `none` so a flaky network never strands the user.
 */
export function useAppVersionCheck(): {
  isCheckComplete: boolean;
  result: VersionCheckResult;
} {
  const platform = Platform.OS;
  const isMobile = isSupportedPlatform(platform);
  const enabled = isMobile && !__DEV__;
  const channel = resolveChannel();

  const query = useQuery({
    ...orpc.appVersion.getAppVersion.queryOptions({
      input: {
        platform: isMobile ? platform : 'ios',
        channel,
      },
    }),
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    if (!enabled) return;
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') query.refetch();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [enabled, query]);

  if (!enabled) {
    return { isCheckComplete: true, result: { action: 'none' } };
  }

  if (query.isLoading) {
    return { isCheckComplete: false, result: { action: 'none' } };
  }

  // Fail-open: errors or no row → no prompt, no block.
  if (query.isError || !query.data) {
    return { isCheckComplete: true, result: { action: 'none' } };
  }

  const row = query.data;
  const clientVersion = parseVersion(Application.nativeApplicationVersion);
  const minimumVersion = parseVersion(row.minimumVersion);
  const latestVersion = parseVersion(row.latestVersion);

  if (!clientVersion || !minimumVersion || !latestVersion) {
    return { isCheckComplete: true, result: { action: 'none' } };
  }

  const clientBuildRaw = Application.nativeBuildVersion;
  const clientBuild = clientBuildRaw ? Number(clientBuildRaw) : null;
  const hasUsableBuild = clientBuild !== null && Number.isInteger(clientBuild);

  const minCmp = compareVersions(clientVersion, minimumVersion);
  const latestCmp = compareVersions(clientVersion, latestVersion);

  // Force-update if the binary version is below the floor, OR if the version
  // matches the floor but the build number is behind (e.g. TestFlight where
  // every build between two version-tagged releases is gated on buildNumber).
  const isBuildBelowMinimum =
    minCmp === 0 && hasUsableBuild && clientBuild < row.buildNumber;
  if (minCmp < 0 || isBuildBelowMinimum) {
    return {
      isCheckComplete: true,
      result: {
        action: 'force-update',
        storeUrl: row.storeUrl,
        minimumVersion: row.minimumVersion,
      },
    };
  }

  // Soft-update if the version is below latest, OR matches latest but the
  // build is behind (only meaningful when minimumVersion < latestVersion).
  const isBuildBehindLatest =
    latestCmp === 0 && hasUsableBuild && clientBuild < row.buildNumber;
  if (latestCmp < 0 || isBuildBehindLatest) {
    return {
      isCheckComplete: true,
      result: {
        action: 'soft-update',
        storeUrl: row.storeUrl,
        latestVersion: row.latestVersion,
      },
    };
  }

  return { isCheckComplete: true, result: { action: 'none' } };
}
