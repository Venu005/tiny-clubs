const fs = require("node:fs");
const path = require("node:path");

const requiredEnvVars = [
  "EXPO_PUBLIC_APP_ENVIRONMENT",
  "EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT",
  "EXPO_PUBLIC_CONVEX_URL_STAGING",
  "EXPO_PUBLIC_CONVEX_URL_PRODUCTION",
  "EXPO_PUBLIC_CONVEX_URL",
];

function readRepoFile(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), "utf8");
}

describe("security policy", () => {
  it(".env.example documents every required environment variable", () => {
    const example = readRepoFile(".env.example");

    for (const variableName of requiredEnvVars) {
      const describedVariable = new RegExp(`# .+\\n${variableName}=`, "m");

      expect(example).toMatch(describedVariable);
    }
  });

  it("CI runs required quality checks before merge", () => {
    const workflow = readRepoFile(".github/workflows/ci.yml");

    for (const command of [
      "pnpm secret-scan",
      "pnpm lint",
      "pnpm typecheck",
      "pnpm test",
      "pnpm test:convex",
      "pnpm check:expo",
    ]) {
      expect(workflow).toMatch(new RegExp(command));
    }
  });

  it("main branch protection requires the CI status check", () => {
    const {
      getCiStatusCheckName,
      getRequiredStatusCheckContexts,
      loadMainRuleset,
      validateMainRuleset,
    } = require("./scripts/branch-protection-config");

    const workflow = readRepoFile(".github/workflows/ci.yml");
    const ruleset = loadMainRuleset();
    const validation = validateMainRuleset({ ruleset, workflowText: workflow });

    expect(validation.errors).toEqual([]);

    const ciStatusCheckName = getCiStatusCheckName(workflow);
    const requiredContexts = getRequiredStatusCheckContexts(ruleset);

    expect(requiredContexts).toContain(ciStatusCheckName);
  });

  it("main branch protection blocks direct pushes and requires pull requests", () => {
    const { loadMainRuleset } = require("./scripts/branch-protection-config");
    const ruleset = loadMainRuleset();
    const ruleTypes = ruleset.rules.map((rule) => rule.type);

    expect(ruleTypes).toContain("pull_request");
    expect(ruleTypes).toContain("required_status_checks");
    expect(ruleset.conditions.ref_name.include).toEqual(["refs/heads/main"]);
  });

  it("secret scanner reports production-looking credentials", () => {
    const { scanTextForSecrets } = require("./scripts/scan-secrets");

    const findings = scanTextForSecrets(
      "tracked.env",
      ["PRODUCTION_API_KEY", "=", "sk", "_live_", "1234567890abcdef"].join("")
    );

    expect(
      findings.some((finding) => finding.pattern === "sensitive assignment")
    ).toBe(true);
  });
});
