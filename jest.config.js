module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-screens|react-native-safe-area-context|@react-navigation|convex|@clerk|expo-constants)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
};
