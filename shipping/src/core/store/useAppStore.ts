import { createStore } from './createStore';

interface AppState {
  isOnboarded: boolean;
  language: 'en' | 'vi';
  notificationsEnabled: boolean;
}

interface AppActions {
  setOnboarded: (value: boolean) => void;
  setLanguage: (lang: 'en' | 'vi') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  reset: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  isOnboarded: false,
  language: 'vi',
  notificationsEnabled: true,
};

export const useAppStore = createStore<AppStore>(
  (set) => ({
    ...initialState,

    setOnboarded: (value) => set({ isOnboarded: value }),

    setLanguage: (lang) => set({ language: lang }),

    setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

    reset: () => set(initialState),
  }),
  {
    name: 'app-store',
    storage: 'async',
    version: 1,
    migrate: (persistedState: any, version: number) => {
      return persistedState as AppStore;
    },
    partialize: (state) => {
      // Không lưu isOnboarded vào AsyncStorage
      // để mỗi lần mở app đều hiển thị Onboarding
      const { isOnboarded, ...rest } = state;
      return rest;
    },
  },
);
