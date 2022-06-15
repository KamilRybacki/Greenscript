module.exports = {
  'preset': 'solid-jest/preset/browser',
  'setupFilesAfterEnv': ['./setupTests.ts'],
  'roots': ['__tests__'],
  'testMatch': [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '!**/__mocks__/**/*.+(ts|tsx|js)',
  ],
};
