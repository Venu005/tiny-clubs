const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

describe("test harness", () => {
  it("reports syntax errors with the failing test file path", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-clubs-jest-"));
    const brokenTestFile = path.join(tempDir, "broken.test.js");

    fs.writeFileSync(brokenTestFile, "this is not valid javascript {{{");

    try {
      execFileSync("pnpm", ["exec", "jest", brokenTestFile, "--runInBand"], {
        cwd: path.join(__dirname),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      throw new Error("Expected jest to exit with a non-zero status");
    } catch (error) {
      expect(error.status).not.toBe(0);

      const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
      expect(output).toMatch(/broken\.test\.js/);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
