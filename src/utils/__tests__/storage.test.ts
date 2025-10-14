import { zustandStorage } from '../storage';

// Mock MMKV to simulate it not being available
jest.mock('react-native-mmkv', () => {
  throw new Error('MMKV not available in test environment');
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('Storage Utility', () => {
  it('should provide storage interface', () => {
    expect(zustandStorage).toBeDefined();
    expect(zustandStorage.setItem).toBeDefined();
    expect(zustandStorage.getItem).toBeDefined();
    expect(zustandStorage.removeItem).toBeDefined();
  });

  it('should handle setItem', async () => {
    const result = zustandStorage.setItem('test', 'value');
    // Should not throw
    expect(result).toBeDefined();
  });

  it('should handle getItem', async () => {
    const result = zustandStorage.getItem('test');
    // Should not throw
    expect(result).toBeDefined();
  });

  it('should handle removeItem', async () => {
    const result = zustandStorage.removeItem('test');
    // Should not throw
    expect(result).toBeDefined();
  });
});
