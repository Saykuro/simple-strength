import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageInterface {
  setItem: (name: string, value: string) => Promise<void> | void;
  getItem: (name: string) => Promise<string | null> | string | null;
  removeItem: (name: string) => Promise<void> | void;
}

// Try to use MMKV, fall back to AsyncStorage if not available
let storage: StorageInterface;

try {
  // Try to import and initialize MMKV
  const { MMKV } = require('react-native-mmkv');
  const mmkvStorage = new MMKV();

  storage = {
    setItem: (name: string, value: string) => {
      mmkvStorage.set(name, value);
    },
    getItem: (name: string) => {
      const value = mmkvStorage.getString(name);
      return value ?? null;
    },
    removeItem: (name: string) => {
      mmkvStorage.delete(name);
    },
  };

  console.log('✅ Using MMKV for storage');
} catch (error) {
  // Fall back to AsyncStorage
  console.log('⚠️ MMKV not available, falling back to AsyncStorage:', error);

  storage = {
    setItem: async (name: string, value: string) => {
      await AsyncStorage.setItem(name, value);
    },
    getItem: async (name: string) => {
      return await AsyncStorage.getItem(name);
    },
    removeItem: async (name: string) => {
      await AsyncStorage.removeItem(name);
    },
  };
}

// Create a unified interface for Zustand
export const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.setItem(name, value);
  },
  getItem: (name: string) => {
    return storage.getItem(name);
  },
  removeItem: (name: string) => {
    return storage.removeItem(name);
  },
};

export default storage;
