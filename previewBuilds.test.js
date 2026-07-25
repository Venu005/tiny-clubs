const fs = require("node:fs");
const path = require("node:path");

const easConfig = require("./eas.json");
const appConfig = require("./app.json");
const packageJson = require("./package.json");

const runbookPath = path.join(
  __dirname,
  "docs",
  "runbooks",
  "preview-builds.md"
);

function readRunbook() {
  return fs.readFileSync(runbookPath, "utf8");
}

describe("physical device preview builds", () => {
  it("configures an Android preview profile that produces an installable APK", () => {
    expect(appConfig.expo.android.package).toBe("com.venusai.tinyclubs");
    expect(easConfig.build.preview.distribution).toBe("internal");
    expect(easConfig.build.preview.android.buildType).toBe("apk");
  });

  it("configures an iOS preview profile for physical devices", () => {
    expect(appConfig.expo.ios.bundleIdentifier).toBe("com.venusai.tinyclubs");
    expect(easConfig.build.preview.distribution).toBe("internal");
    expect(easConfig.build.preview.ios.simulator).toBe(false);
  });

  it("exposes platform-specific preview build commands", () => {
    expect(packageJson.scripts["build:preview:android"]).toContain(
      "eas build --platform android --profile preview"
    );
    expect(packageJson.scripts["build:preview:android"]).toContain(
      "preview-build-help.js android"
    );
    expect(packageJson.scripts["build:preview:ios"]).toContain(
      "eas build --platform ios --profile preview"
    );
    expect(packageJson.scripts["build:preview:ios"]).toContain(
      "preview-build-help.js ios"
    );
  });

  it("documents physical install and missing credential remediation", () => {
    const runbook = readRunbook();

    expect(runbook).toMatch(/physical Android/i);
    expect(runbook).toMatch(/physical iOS/i);
    expect(runbook).toMatch(/eas build --platform android --profile preview/);
    expect(runbook).toMatch(/eas build --platform ios --profile preview/);
    expect(runbook).toMatch(/eas device:create/);
    expect(runbook).toMatch(/Android keystore/i);
    expect(runbook).toMatch(/ad hoc provisioning profile/i);
    expect(runbook).toMatch(/Backend unavailable/);
  });

  it("prints actionable remediation when a preview build fails", () => {
    const { getPreviewBuildFailureHelp } = require("./scripts/preview-build-help");

    expect(getPreviewBuildFailureHelp("android")).toMatch(/Android keystore/);
    expect(getPreviewBuildFailureHelp("ios")).toMatch(/eas device:create/);
    expect(getPreviewBuildFailureHelp("ios")).toMatch(
      /ad hoc provisioning profile/
    );
  });
});
