const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Convex modules
jest.mock('convex/react', () => ({
  ConvexProvider: ({ children }) => children,
  ConvexReactClient: jest.fn(),
  useQuery: jest.fn(() => null),
  useMutation: jest.fn(() => jest.fn()),
}));

// Mock removed dependencies - not needed anymore

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

global.__DEV__ = true;