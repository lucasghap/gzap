import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TimerState {
  endTime: number | null;
  setEndTime: (endTime: number) => void;
  clearEndTime: () => void;
}

const useTimerStore = create(
  persist<TimerState>(
    (set) => ({
      endTime: null,
      setEndTime: (endTime: number) => set({ endTime }),
      clearEndTime: () => set({ endTime: null }),
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useTimerStore;
