module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json', 'node'],  // Removed 'ts' as TypeScript is not used
  roots: [
    '.',
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/config/",
    "/logger/",
    "/migrations/",
    "/utils/",
  ],
  testEnvironment: 'node',
  testTimeout: 60000,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
