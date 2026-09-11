import { create } from 'zustand';

interface BadgeState {
  pm: number;
  notif: number;
  setPm: (n: number) => void;
  setNotif: (n: number) => void;
}

export const useBadgeStore = create<BadgeState>((set) => ({
  pm: 0,
  notif: 0,
  setPm: (n) => set({ pm: n }),
  setNotif: (n) => set({ notif: n }),
}));
