module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)', '<rootDir>/src/**/?(*.)+(spec|test).(ts|tsx|js)'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '.',
        outputName: 'jest-results.xml',
      },
    ],
  ],
};
