export type BackendEnvironmentName = "development" | "staging" | "production";

export type BackendConfig = {
  environmentName: BackendEnvironmentName;
  convexUrl: string | null;
};

export declare const PROFILE_NAMES: readonly BackendEnvironmentName[];

export declare function resolveBackendConfig(
  env: Partial<Record<string, string | undefined>>
): BackendConfig;
