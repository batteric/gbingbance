import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAdmin: false,
      setAuth: (token, user) =>
        set({ token, user, isAdmin: !!user.is_admin }),
      setUser: (user) =>
        set({ user, isAdmin: !!user.is_admin }),
      logout: () =>
        set({ token: null, user: null, isAdmin: false }),
    }),
    { name: 'gbingbance-auth' }
  )
);
