import { create } from 'zustand';
import { UserRole } from '../types';

interface UserState {
  role: UserRole | null;
  userId: string;
  userName: string;
  setRole: (role: UserRole, userId: string, userName: string) => void;
  clearRole: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  userId: '',
  userName: '',
  setRole: (role, userId, userName) => set({ role, userId, userName }),
  clearRole: () => set({ role: null, userId: '', userName: '' }),
}));
