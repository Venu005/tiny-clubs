const fs = require("node:fs");
const path = require("node:path");

const PREREQUISITES_DOC = path.join(
  __dirname,
  "docs",
  "sprint",
  "account-and-ownership-prerequisites.md"
);

function readPrerequisitesDoc() {
  return fs.readFileSync(PREREQUISITES_DOC, "utf8");
}

function section(text, heading, level = 2) {
  const hashes = "#".repeat(level);
  const pattern = new RegExp(
    `${hashes} ${heading}[\\s\\S]*?(?=\\n#{1,${level}} |\\n---|$)`
  );
  const match = text.match(pattern);

  expect(match).toBeTruthy();
  return match[0];
}

describe("account prerequisites documentation", () => {
  it("records Apple Developer account status and access holder", () => {
    const doc = readPrerequisitesDoc();
    const appleSection = section(doc, "Apple Developer account");

    expect(appleSection).toMatch(/\*\*Pending verification\*\*|Status \| \*\*/);
    expect(appleSection).toMatch(/Access holder \| \*\*Venu005\*\*/);
  });

  it("records Google Play Console status and access holder", () => {
    const doc = readPrerequisitesDoc();
    const playSection = section(doc, "Google Play Console access");

    expect(playSection).toMatch(/\*\*Pending verification\*\*|Status \| \*\*/);
    expect(playSection).toMatch(/Access holder \| \*\*Venu005\*\*/);
  });

  it("records domain ownership and deep-link prerequisites", () => {
    const doc = readPrerequisitesDoc();
    const domainSection = section(
      doc,
      "Domain ownership and deep-link configuration"
    );

    expect(domainSection).toMatch(/Domain owner \| \*\*Venu005\*\*/);
    expect(domainSection).toMatch(/apple-app-site-association/);
    expect(domainSection).toMatch(/assetlinks\.json/);
    expect(domainSection).toMatch(/associatedDomains/);
  });

  it("lists blockers and next actions for pending verification", () => {
    const doc = readPrerequisitesDoc();

    for (const heading of [
      "Apple Developer account",
      "Google Play Console access",
      "Domain ownership and deep-link configuration",
    ]) {
      const sectionText = section(doc, heading);
      const pendingSection = section(sectionText, "Pending verification", 3);

      expect(pendingSection).toMatch(/\| Blocker \| Next action \|/);
      expect(pendingSection).toMatch(
        /\| Blocker \| Next action \|[\s\S]+\| --- \| --- \|[\s\S]+\| [^|]+ \| [^|]+ \|/
      );
    }
  });
});
