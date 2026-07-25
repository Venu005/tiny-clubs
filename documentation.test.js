const fs = require("node:fs");
const path = require("node:path");

const ADR_PATH = path.join(
  __dirname,
  "docs",
  "adr",
  "0001-use-convex-as-backend.md"
);
const RUNBOOK_PATH = path.join(__dirname, "docs", "runbooks", "environments.md");

const requiredEnvVars = [
  "EXPO_PUBLIC_APP_ENVIRONMENT",
  "EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT",
  "EXPO_PUBLIC_CONVEX_URL_STAGING",
  "EXPO_PUBLIC_CONVEX_URL_PRODUCTION",
  "EXPO_PUBLIC_CONVEX_URL",
];

function readDoc(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

describe("architecture documentation", () => {
  it("ADR explains the chosen backend approach and rationale", () => {
    const adr = readDoc(ADR_PATH);

    expect(adr).toMatch(/Use Convex as the application backend/);
    expect(adr).toMatch(/## Decision[\s\S]*Convex/);
    expect(adr).toMatch(/## Rationale/);
    expect(adr).toMatch(/## Alternatives considered/);
    expect(adr).toMatch(/Real-time updates/);
  });

  it("environments runbook covers development and staging setup", () => {
    const runbook = readDoc(RUNBOOK_PATH);

    expect(runbook).toMatch(/## Configure development/);
    expect(runbook).toMatch(/## Configure staging/);
    expect(runbook).toMatch(/EXPO_PUBLIC_APP_ENVIRONMENT=development/);
    expect(runbook).toMatch(/EXPO_PUBLIC_APP_ENVIRONMENT=staging/);
    expect(runbook).toMatch(/pnpm start:development/);
    expect(runbook).toMatch(/pnpm start:staging/);
  });

  it("runbook documents exact variable names and where to obtain values", () => {
    const runbook = readDoc(RUNBOOK_PATH);

    expect(runbook).toMatch(/## Required variables/);
    expect(runbook).toMatch(/\| Variable \| Required for \| Where to obtain the value \|/);

    for (const variableName of requiredEnvVars) {
      expect(runbook).toMatch(new RegExp(`\`${variableName}\``));
      expect(runbook).toMatch(
        new RegExp(`\\| \`${variableName}\` \\| [^|]+ \\| [^|]+ \\|`)
      );
    }
  });

  it("runbook maps missing variables to explicit remediation steps", () => {
    const runbook = readDoc(RUNBOOK_PATH);

    expect(runbook).toMatch(/### Missing variable guide/);
    expect(runbook).toMatch(/\| Symptom \| Missing variable \| Fix \|/);
    expect(runbook).toMatch(/EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT/);
    expect(runbook).toMatch(/EXPO_PUBLIC_CONVEX_URL_STAGING/);
  });
});
