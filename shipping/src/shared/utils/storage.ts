import { STORAGE_KEYS } from '@constants/app.constants';

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

class StorageService {
  private storage: Map<string, string> = new Map();

  async getItem<T>(key: StorageKey): Promise<T | null> {
    try {
      const value = this.storage.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: StorageKey, value: T): Promise<void> {
    try {
      this.storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to storage: ${error}`);
    }
  }

  async removeItem(key: StorageKey): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async multiGet<T>(keys: StorageKey[]): Promise<Map<StorageKey, T | null>> {
    const results = new Map<StorageKey, T | null>();
    for (const key of keys) {
      const value = await this.getItem<T>(key);
      results.set(key, value);
    }
    return results;
  }
}

export const storage = new StorageService();
