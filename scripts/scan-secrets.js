#!/usr/bin/env node

const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const tokenPatterns = [
  {
    name: "live secret key",
    pattern: new RegExp(["sk", "live", "[A-Za-z0-9_\\-]{12,}"].join("_")),
  },
  {
    name: "GitHub token",
    pattern: new RegExp(["ghp", "[A-Za-z0-9_]{20,}"].join("_")),
  },
  {
    name: "AWS access key",
    pattern: /AKIA[0-9A-Z]{16}/,
  },
  {
    name: "private key",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  },
  {
    name: "Slack token",
    pattern: /xox[baprs]-[A-Za-z0-9-]{20,}/,
  },
];

const sensitiveAssignmentPattern =
  /^\s*(?:export\s+)?([A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PRIVATE_KEY|API_KEY|DEPLOY_KEY|ACCESS_KEY)[A-Z0-9_]*)\s*[:=]\s*['"]?([^'"\s#]+)/;

const placeholderPattern =
  /^(?:|changeme|change-me|example|placeholder|replace-me|your-.+|<.+>|\$\{.+\})$/i;

function isAllowedAssignmentValue(value) {
  return placeholderPattern.test(value);
}

function scanTextForSecrets(filePath, text) {
  const findings = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const assignmentMatch = line.match(sensitiveAssignmentPattern);

    if (
      assignmentMatch &&
      !isAllowedAssignmentValue(assignmentMatch[2].trim())
    ) {
      findings.push({
        filePath,
        line: index + 1,
        pattern: "sensitive assignment",
      });
    }

    for (const tokenPattern of tokenPatterns) {
      if (tokenPattern.pattern.test(line)) {
        findings.push({
          filePath,
          line: index + 1,
          pattern: tokenPattern.name,
        });
      }
    }
  });

  return findings;
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

function getScannableFiles() {
  return git(["ls-files", "--cached", "--others", "--exclude-standard", "-z"])
    .split("\0")
    .filter(Boolean);
}

function scanWorkingTree() {
  return getScannableFiles().flatMap((filePath) => {
    try {
      const text = fs.readFileSync(filePath, "utf8");
      return scanTextForSecrets(filePath, text);
    } catch {
      return [];
    }
  });
}

function scanGitHistory() {
  const commits = git(["rev-list", "--all"])
    .split("\n")
    .filter(Boolean);
  const findings = [];

  for (const commit of commits) {
    const files = git(["ls-tree", "-r", "--name-only", commit])
      .split("\n")
      .filter(Boolean);

    for (const filePath of files) {
      let text;

      try {
        text = git(["show", `${commit}:${filePath}`]);
      } catch {
        continue;
      }

      findings.push(
        ...scanTextForSecrets(`${commit.slice(0, 12)}:${filePath}`, text)
      );
    }
  }

  return findings;
}

function runCli() {
  const shouldScanHistory = process.argv.includes("--history");
  const findings = [
    ...scanWorkingTree(),
    ...(shouldScanHistory ? scanGitHistory() : []),
  ];

  if (findings.length > 0) {
    console.error("Secret scan failed. Potential secrets found:");

    for (const finding of findings) {
      console.error(
        `- ${finding.filePath}:${finding.line} (${finding.pattern})`
      );
    }

    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  scanTextForSecrets,
};
