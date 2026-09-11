import { create } from 'zustand';
import type { Room } from '../types';

interface RoomState {
  currentRoom: Room | null;
  isHost: boolean;
  setCurrentRoom: (room: Room | null, userId?: number) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  isHost: false,
  setCurrentRoom: (room, userId) =>
    set({
      currentRoom: room,
      isHost: !!(room && userId && room.created_by === userId),
    }),
  clearRoom: () => set({ currentRoom: null, isHost: false }),
}));
