import { create } from 'zustand';
import { UserRole } from '../types';

const STORAGE_KEY = 'auction_user_store';

interface UserState {
  role: UserRole | null;
  userId: string;
  userName: string;
  setRole: (role: UserRole, userId: string, userName: string) => void;
  clearRole: () => void;
}

const getInitialState = (): Pick<UserState, 'role' | 'userId' | 'userName'> => {
  if (typeof window === 'undefined') {
    return { role: null, userId: '', userName: '' };
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        role: parsed.role || null,
        userId: parsed.userId || '',
        userName: parsed.userName || '',
      };
    }
  } catch (e) {
    console.error('Failed to load user store from localStorage', e);
  }
  return { role: null, userId: '', userName: '' };
};

const initialState = getInitialState();

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  setRole: (role, userId, userName) => {
    const state = { role, userId, userName };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save user store to localStorage', e);
    }
    set(state);
  },
  clearRole: () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear user store from localStorage', e);
    }
    set({ role: null, userId: '', userName: '' });
  },
}));
