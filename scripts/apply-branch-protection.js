#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const {
  loadMainRuleset,
  validateMainRuleset,
} = require("./branch-protection-config");

function runGh(args, input) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    input,
  });
}

function getRepository() {
  const remoteUrl = execFileSync("git", ["remote", "get-url", "origin"], {
    encoding: "utf8",
  }).trim();

  const sshMatch = remoteUrl.match(/git@github\.com:(.+?)(?:\.git)?$/);
  const httpsMatch = remoteUrl.match(/github\.com[/:](.+?)(?:\.git)?$/);
  const repository = sshMatch?.[1] ?? httpsMatch?.[1];

  if (!repository) {
    throw new Error(`Could not determine GitHub repository from ${remoteUrl}`);
  }

  return repository;
}

function listRulesets(repository) {
  return JSON.parse(runGh(["api", `repos/${repository}/rulesets`]));
}

function createRuleset(repository, ruleset) {
  return JSON.parse(
    runGh(
      [
        "api",
        "--method",
        "POST",
        `repos/${repository}/rulesets`,
        "--input",
        "-",
      ],
      JSON.stringify(ruleset)
    )
  );
}

function updateRuleset(repository, rulesetId, ruleset) {
  return JSON.parse(
    runGh(
      [
        "api",
        "--method",
        "PUT",
        `repos/${repository}/rulesets/${rulesetId}`,
        "--input",
        "-",
      ],
      JSON.stringify(ruleset)
    )
  );
}

function applyMainRuleset() {
  const validation = validateMainRuleset();

  if (validation.errors.length > 0) {
    console.error("Branch protection config is invalid:");
    for (const error of validation.errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  const repository = getRepository();
  const ruleset = loadMainRuleset();
  const existingRulesets = listRulesets(repository);
  const existingRuleset = existingRulesets.find(
    (candidate) => candidate.name === ruleset.name
  );

  const result = existingRuleset
    ? updateRuleset(repository, existingRuleset.id, ruleset)
    : createRuleset(repository, ruleset);

  console.log(
    `${existingRuleset ? "Updated" : "Created"} ruleset "${result.name}" (id ${result.id}) for ${repository}`
  );
  console.log(`Required status check: ${validation.ciStatusCheckName}`);
}

if (require.main === module) {
  try {
    applyMainRuleset();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

module.exports = {
  applyMainRuleset,
};
