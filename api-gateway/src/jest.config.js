/** @type {import('jest').Config} */
const config = {
    verbose: true,
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: [
      "\\\\node_modules\\\\",
      "index.js",
      "logger.js"
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
  
    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    // moduleNameMapper: {},
  
    // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
    // modulePathIgnorePatterns: [],
  
    // The root directory that Jest should scan for tests and modules within
    rootDir: '.',
  
    // A list of paths to directories that Jest should use to search for files in
    // roots: [
    //   "<rootDir>"
    // ],
  
    // The paths to modules that run some code to configure or set up the testing environment before each test
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