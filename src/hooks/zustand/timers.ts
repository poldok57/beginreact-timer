import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist } from "zustand/middleware";
import { Timer } from "../../types/timer";

const zustandTimersStore = create(
  persist(
    (set, get) => ({
      timers: [],
      addTimer: (timer: Timer) =>
        set((state) => ({ timers: [...state.timers, timer] })),

      updateTimer: (timerId: string, updatedTimer: Timer) =>
        set((state: { timers: Timer[] }) => ({
          timers: state.timers.map((timer) =>
            timer.id === timerId ? updatedTimer : timer
          ),
        })),
      delTimer: (timerId: string) =>
        set((state: { timers: Timer[] }) => ({
          timers: state.timers.filter((timer) => timer.id !== timerId),
        })),
      eraseList: () => set({ timers: [] }),
    }),
    {
      name: "timer-storage", // unique name
      getStorage: () => localStorage,
    }
  )
);

export const useTimersStore = () => {
  return zustandTimersStore(
    useShallow((state: any) => ({
      timers: state.timers,
      addTimer: state.addTimer,
      delTimer: state.delTimer,
      updateTimer: state.updateTimer,
    }))
  );
};
