export type HealthResponse = {
  environmentName: string;
};

export type HealthDisplayState =
  | {
      kind: "loading";
      label: string;
    }
  | {
      kind: "ready";
      label: string;
    }
  | {
      kind: "error";
      title: string;
      message: string;
    };

export declare const CONFIGURATION_ERROR_MESSAGE: string;

export declare function getHealthDisplayState(
  health: HealthResponse | undefined,
  hasBackendConfig: boolean
): HealthDisplayState;
