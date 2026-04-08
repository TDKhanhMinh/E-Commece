import { create, StateCreator } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageType = 'async' | 'none';

interface CreateStoreOptions<T = any> {
  name: string;
  storage?: StorageType;
  devtools?: boolean;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: any, version: number) => T | Promise<T>;
}

export function createStore<T extends object>(
  initializer: StateCreator<T, [], []>,
  options: CreateStoreOptions<T>,
) {
  const { name, storage = 'none', devtools: enableDevtools = __DEV__, partialize, version, migrate } = options;

  let store = initializer;

  if (storage === 'async') {
    store = persist(store, {
      name,
      storage: createJSONStorage(() => AsyncStorage),
      ...(partialize ? { partialize } : {}),
      ...(version !== undefined ? { version } : {}),
      ...(migrate ? { migrate } : {}),
    }) as StateCreator<T, [], []>;
  }

  if (enableDevtools) {
    store = devtools(store, { name }) as StateCreator<T, [], []>;
  }

  return create<T>()(store);
}

export function createSelectors<T extends object>(store: ReturnType<typeof create<T>>) {
  const selectors: { [K in keyof T]: () => T[K] } = {} as { [K in keyof T]: () => T[K] };

  for (const key of Object.keys(store.getState()) as (keyof T)[]) {
    selectors[key] = () => store((state) => state[key]);
  }

  return selectors;
}
