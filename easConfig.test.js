const easConfig = require("./eas.json");

describe("eas.json", () => {
  it("EAS build profiles select isolated service environments", () => {
    expect(easConfig.build.development.environment).toBe("development");
    expect(easConfig.build.development.env.EXPO_PUBLIC_APP_ENVIRONMENT).toBe(
      "development"
    );

    expect(easConfig.build.staging.environment).toBe("staging");
    expect(easConfig.build.staging.env.EXPO_PUBLIC_APP_ENVIRONMENT).toBe(
      "staging"
    );

    expect(easConfig.build.production.environment).toBe("production");
    expect(easConfig.build.production.env.EXPO_PUBLIC_APP_ENVIRONMENT).toBe(
      "production"
    );
  });
});
