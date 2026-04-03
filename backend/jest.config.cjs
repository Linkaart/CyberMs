module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.spec.ts', '**/src/tests/**/*.test.ts', '**/src/tests/**/*.spec.tsx'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  preset: 'ts-jest',
  globalSetup: '<rootDir>/global-setup.js',
  globalTeardown: '<rootDir>/global-teardown.js',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: '.', outputName: 'jest-results.xml' }],
  ],
};
