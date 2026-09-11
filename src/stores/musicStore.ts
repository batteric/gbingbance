import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Playback, Track } from '../types';

interface MusicState {
  enabled: boolean;
  mutedLocal: boolean;
  playback: Playback | null;
  currentTrack: Track | null;
  setEnabled: (v: boolean) => void;
  setMutedLocal: (v: boolean) => void;
  setPlayback: (p: Playback | null) => void;
  setCurrentTrack: (t: Track | null) => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      enabled: true,
      mutedLocal: false,
      playback: null,
      currentTrack: null,
      setEnabled: (v) => set({ enabled: v }),
      setMutedLocal: (v) => set({ mutedLocal: v }),
      setPlayback: (p) => set({ playback: p }),
      setCurrentTrack: (t) => set({ currentTrack: t }),
    }),
    {
      name: 'gbingbance-music',
      partialize: (s) => ({ mutedLocal: s.mutedLocal }),
    }
  )
);
