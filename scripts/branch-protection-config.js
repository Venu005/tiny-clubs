const fs = require("node:fs");
const path = require("node:path");

const RULESET_PATH = path.join(
  __dirname,
  "..",
  ".github",
  "branch-protection",
  "main.ruleset.json"
);

const CI_WORKFLOW_PATH = path.join(
  __dirname,
  "..",
  ".github",
  "workflows",
  "ci.yml"
);

function readRepoFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function getCiStatusCheckName(workflowText) {
  const jobKeyMatch = workflowText.match(/^jobs:\r?\n\s+(\S+):/m);

  if (!jobKeyMatch) {
    throw new Error("Could not parse CI workflow job id");
  }

  const jobSectionMatch = workflowText.match(
    new RegExp(`^  ${jobKeyMatch[1]}:\\n    name:\\s*(.+)\\s*$`, "m")
  );

  return jobSectionMatch ? jobSectionMatch[1].trim() : jobKeyMatch[1];
}

function loadMainRuleset() {
  return JSON.parse(readRepoFile(RULESET_PATH));
}

function getRequiredStatusCheckContexts(ruleset) {
  const statusCheckRule = ruleset.rules.find(
    (rule) => rule.type === "required_status_checks"
  );

  if (!statusCheckRule) {
    return [];
  }

  return statusCheckRule.parameters.required_status_checks.map(
    (check) => check.context
  );
}

function validateMainRuleset({
  ruleset = loadMainRuleset(),
  workflowText = readRepoFile(CI_WORKFLOW_PATH),
} = {}) {
  const errors = [];
  const ciStatusCheckName = getCiStatusCheckName(workflowText);

  if (ruleset.target !== "branch") {
    errors.push('Ruleset target must be "branch"');
  }

  if (ruleset.enforcement !== "active") {
    errors.push('Ruleset enforcement must be "active"');
  }

  const protectedRefs = ruleset.conditions?.ref_name?.include ?? [];
  if (!protectedRefs.includes("refs/heads/main")) {
    errors.push('Ruleset must protect "refs/heads/main"');
  }

  const ruleTypes = ruleset.rules.map((rule) => rule.type);

  if (!ruleTypes.includes("update")) {
    errors.push("Ruleset must restrict direct updates to main");
  }

  if (!ruleTypes.includes("pull_request")) {
    errors.push("Ruleset must require pull requests before merging");
  }

  if (!ruleTypes.includes("required_status_checks")) {
    errors.push("Ruleset must require status checks before merging");
  }

  const requiredContexts = getRequiredStatusCheckContexts(ruleset);

  if (requiredContexts.length === 0) {
    errors.push("Ruleset must list at least one required status check");
  }

  if (!requiredContexts.includes(ciStatusCheckName)) {
    errors.push(
      `Ruleset must require the CI status check "${ciStatusCheckName}"`
    );
  }

  const statusCheckRule = ruleset.rules.find(
    (rule) => rule.type === "required_status_checks"
  );

  if (
    statusCheckRule &&
    statusCheckRule.parameters.strict_required_status_checks_policy !== true
  ) {
    errors.push("Ruleset must require branches to be up to date before merging");
  }

  return {
    ciStatusCheckName,
    requiredContexts,
    errors,
  };
}

module.exports = {
  CI_WORKFLOW_PATH,
  RULESET_PATH,
  getCiStatusCheckName,
  getRequiredStatusCheckContexts,
  loadMainRuleset,
  validateMainRuleset,
};
