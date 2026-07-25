const fs = require("node:fs");
const path = require("node:path");

const DEMO_SCRIPT_PATH = path.join(
  __dirname,
  "docs",
  "sprint",
  "demo-script.md"
);
const RETRO_CHECKLIST_PATH = path.join(
  __dirname,
  "docs",
  "sprint",
  "retro-checklist.md"
);

function readDoc(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

describe("sprint demo and retro documentation", () => {
  it("demo script covers installing both preview builds and showing health", () => {
    const demoScript = readDoc(DEMO_SCRIPT_PATH);

    expect(demoScript).toMatch(/## 2\. Install the development preview build/);
    expect(demoScript).toMatch(/## 3\. Install the staging preview build/);
    expect(demoScript).toMatch(/## 4\. Show the health response/);
    expect(demoScript).toMatch(/Environment: development/);
    expect(demoScript).toMatch(/Environment: staging/);
    expect(demoScript).toMatch(/eas build --profile development/);
    expect(demoScript).toMatch(/eas build --profile staging/);
  });

  it("demo script documents CI lint failure, block, fix, and merge flow", () => {
    const demoScript = readDoc(DEMO_SCRIPT_PATH);

    expect(demoScript).toMatch(/## 5\. Demonstrate CI blocking a bad merge/);
    expect(demoScript).toMatch(/Introduce a lint failure/);
    expect(demoScript).toMatch(/CI \/ verify.*fail/i);
    expect(demoScript).toMatch(/merge is blocked|merge blocked/i);
    expect(demoScript).toMatch(/Restore lint to green/);
    expect(demoScript).toMatch(/PR becomes mergeable|mergeable/i);
    expect(demoScript).toMatch(/pnpm lint/);
  });

  it("retro checklist captures wins, problems, and Sprint 2 improvements", () => {
    const retro = readDoc(RETRO_CHECKLIST_PATH);

    expect(retro).toMatch(/## What went well/);
    expect(retro).toMatch(/## What didn't go well/);
    expect(retro).toMatch(/## Concrete improvements for Sprint 2/);
    expect(retro).toMatch(/at least one/i);
    expect(retro).toMatch(/Sprint 2/);
    expect(retro).toMatch(/\| 1 \|/);
  });
});
