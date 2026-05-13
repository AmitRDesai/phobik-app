import { orpc } from '@/lib/orpc';
import { useQuery } from '@tanstack/react-query';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import semver from 'semver';

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
  const clientVersionRaw = Application.nativeApplicationVersion;
  const clientBuildRaw = Application.nativeBuildVersion;
  const clientVersion = clientVersionRaw
    ? semver.valid(semver.coerce(clientVersionRaw))
    : null;
  const minimumVersion = semver.valid(semver.coerce(row.minimumVersion));
  const latestVersion = semver.valid(semver.coerce(row.latestVersion));

  if (!clientVersion || !minimumVersion || !latestVersion) {
    return { isCheckComplete: true, result: { action: 'none' } };
  }

  if (semver.lt(clientVersion, minimumVersion)) {
    return {
      isCheckComplete: true,
      result: {
        action: 'force-update',
        storeUrl: row.storeUrl,
        minimumVersion: row.minimumVersion,
      },
    };
  }

  const clientBuild = clientBuildRaw ? Number(clientBuildRaw) : null;
  const isBuildBehind =
    semver.eq(clientVersion, latestVersion) &&
    clientBuild !== null &&
    Number.isInteger(clientBuild) &&
    clientBuild < row.buildNumber;

  if (semver.lt(clientVersion, latestVersion) || isBuildBehind) {
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
