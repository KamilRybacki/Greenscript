module.exports = {
  'preset': 'solid-jest/preset/browser',
  'setupFilesAfterEnv': ['./setupTests.ts'],
  'testPathIgnorePatterns': [
    '__tests__/TestsComponent.tsx',
    'utils.ts',
  ],
};
