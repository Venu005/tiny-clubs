const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

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

test(".env.example documents every required environment variable", () => {
  const example = readRepoFile(".env.example");

  for (const variableName of requiredEnvVars) {
    const describedVariable = new RegExp(
      `# .+\\n${variableName}=`,
      "m"
    );

    assert.match(
      example,
      describedVariable,
      `${variableName} must have a brief description`
    );
  }
});

test("CI runs required quality checks before merge", () => {
  const workflow = readRepoFile(".github/workflows/ci.yml");

  for (const command of [
    "pnpm secret-scan",
    "pnpm lint",
    "pnpm typecheck",
    "pnpm test",
    "pnpm test:convex",
    "pnpm check:expo",
  ]) {
    assert.match(workflow, new RegExp(command));
  }
});

test("main branch protection requires the CI status check", () => {
  const {
    getCiStatusCheckName,
    getRequiredStatusCheckContexts,
    loadMainRuleset,
    validateMainRuleset,
  } = require("./scripts/branch-protection-config");

  const workflow = readRepoFile(".github/workflows/ci.yml");
  const ruleset = loadMainRuleset();
  const validation = validateMainRuleset({ ruleset, workflowText: workflow });

  assert.deepEqual(
    validation.errors,
    [],
    validation.errors.join("\n")
  );

  const ciStatusCheckName = getCiStatusCheckName(workflow);
  const requiredContexts = getRequiredStatusCheckContexts(ruleset);

  assert.ok(
    requiredContexts.includes(ciStatusCheckName),
    `Ruleset must require "${ciStatusCheckName}"`
  );
});

test("main branch protection blocks direct pushes and requires pull requests", () => {
  const { loadMainRuleset } = require("./scripts/branch-protection-config");
  const ruleset = loadMainRuleset();
  const ruleTypes = ruleset.rules.map((rule) => rule.type);

  assert.ok(
    ruleTypes.includes("pull_request"),
    "Changes to main must go through pull requests"
  );
  assert.ok(
    ruleTypes.includes("required_status_checks"),
    "Required status checks must block updates until CI passes on another ref"
  );
  assert.deepEqual(ruleset.conditions.ref_name.include, ["refs/heads/main"]);
});

test("secret scanner reports production-looking credentials", () => {
  const { scanTextForSecrets } = require("./scripts/scan-secrets");

  const findings = scanTextForSecrets(
    "tracked.env",
    ["PRODUCTION_API_KEY", "=", "sk", "_live_", "1234567890abcdef"].join("")
  );

  assert.ok(
    findings.some((finding) => finding.pattern === "sensitive assignment")
  );
});
