/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "**/__tests__/**/*.(test|spec).[jt]s?(x)",
    "**/*.(test|spec).[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/convex/", "/e2e/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
