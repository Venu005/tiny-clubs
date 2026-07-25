const fs = require("node:fs");
const path = require("node:path");

const appConfig = require("./app.json");

const expectedBundleIdentifier = "com.venusai.tinyclubs";
const expectedAndroidPackage = "com.venusai.tinyclubs";

function readPngSize(filePath) {
  const png = fs.readFileSync(path.join(__dirname, filePath));

  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
}

function readDoc(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), "utf8");
}

describe("app identity", () => {
  it("matches the recorded iOS bundle identifier", () => {
    const accountDoc = readDoc(
      "docs/sprint/account-and-ownership-prerequisites.md"
    );

    expect(appConfig.expo.ios.bundleIdentifier).toBe(
      expectedBundleIdentifier
    );
    expect(accountDoc).toContain(
      `iOS bundle ID | \`${expectedBundleIdentifier}\``
    );
  });

  it("matches the recorded Android package name", () => {
    const accountDoc = readDoc(
      "docs/sprint/account-and-ownership-prerequisites.md"
    );

    expect(appConfig.expo.android.package).toBe(expectedAndroidPackage);
    expect(accountDoc).toContain(
      `Android application ID | \`${expectedAndroidPackage}\``
    );
  });

  it("configures launcher icon assets for iOS and Android", () => {
    expect(appConfig.expo.icon).toBe("./assets/icon.png");
    expect(appConfig.expo.ios.icon).toBe("./assets/icon.png");
    expect(appConfig.expo.android.adaptiveIcon.foregroundImage).toBe(
      "./assets/adaptive-icon.png"
    );
    expect(appConfig.expo.android.adaptiveIcon.backgroundColor).toMatch(
      /^#[0-9a-f]{6}$/i
    );

    expect(readPngSize("assets/icon.png")).toEqual({
      width: 1024,
      height: 1024,
    });
    expect(readPngSize("assets/adaptive-icon.png")).toEqual({
      width: 1024,
      height: 1024,
    });
  });

  it("documents how to choose unique bundle identifiers", () => {
    const runbook = readDoc("docs/runbooks/app-identity.md");

    expect(runbook).toMatch(/bundle identifier/i);
    expect(runbook).toMatch(/Android package/i);
    expect(runbook).toMatch(/reverse-DNS/i);
    expect(runbook).toMatch(/already taken/i);
    expect(runbook).toMatch(/app\.json/);
    expect(runbook).toContain(expectedBundleIdentifier);
    expect(runbook).toContain(expectedAndroidPackage);
  });
});
