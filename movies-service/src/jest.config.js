/** @type {import('jest').Config} */
const config = {
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\",
    "logger.js",
    "logMiddleware.js",
    "authStubMiddleware.js"
  ],
  coverageProvider: "v8",
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],
  moduleDirectories: [
    "node_modules"
  ],
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  rootDir: '.',
  setupFiles: ['<rootDir>/jest.setup.js'], // dotenv/config

  testEnvironment: "jest-environment-node", // jest-environment-node
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  testPathIgnorePatterns: [
    "\\\\node_modules\\\\"  // \\\\node_modules\\\\
  ],
};

module.exports = config;
