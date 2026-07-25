#!/usr/bin/env node

function getPreviewBuildFailureHelp(platform) {
  if (platform === "ios") {
    return [
      "Preview iOS build failed.",
      "",
      "Check these prerequisites:",
      "- Register the physical device with: eas device:create",
      "- Repair signing with: eas credentials --platform ios",
      "- Ensure the Apple distribution certificate and ad hoc provisioning profile exist for com.venusai.tinyclubs",
      "- Ensure EXPO_PUBLIC_CONVEX_URL_STAGING is set in the EAS staging environment",
    ].join("\n");
  }

  return [
    "Preview Android build failed.",
    "",
    "Check these prerequisites:",
    "- Repair signing with: eas credentials --platform android",
    "- Ensure the Android keystore exists for com.venusai.tinyclubs",
    "- Ensure EXPO_PUBLIC_CONVEX_URL_STAGING is set in the EAS staging environment",
  ].join("\n");
}

function runCli() {
  const platform = process.argv[2] === "ios" ? "ios" : "android";
  console.error(getPreviewBuildFailureHelp(platform));
  process.exitCode = 1;
}

if (require.main === module) {
  runCli();
}

module.exports = {
  getPreviewBuildFailureHelp,
};
