"use client";
import { use, useEffect } from "react";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist, createJSONStorage } from "zustand/middleware";
import { Timer } from "../../types/timer";

interface TimerState {
  maximize: string;
  lastEnded: string;
  minimizedInput: boolean;
  timers: Timer[];
}

const zustandTimersStore = create(
  persist(
    (set, get) => ({
      timers: [],
      maximize: "",
      lastEnded: "",
      minimizedInput: false,
      setTimers(timers: Timer[]) {
        set({ timers });
      },
      addTimer: (timer: Timer) =>
        set((state) => ({ timers: [...state.timers, timer] })),

      updateTimer: (timerId: string, updatedTimer: Timer) =>
        set((state: { timers: Timer[] }) => ({
          timers: state.timers.map((timer) =>
            timer.id === timerId ? updatedTimer : timer
          ),
        })),
      getTimer(timerId: string) {
        return (get() as TimerState).timers.find(
          (timer: Timer) => timer && timer.id === timerId
        );
      },
      delTimer: (timerId: string) =>
        set((state: { timers: Timer[] }) => ({
          timers: state.timers.filter((timer) => timer && timer.id !== timerId),
        })),
      eraseList: () => set({ timers: [] }),
      startTimers: () => {
        const intervalId = setInterval(() => {
          const currentTime = Date.now();
          set((state: { timers: Timer[] }) => {
            const updatedTimers = state.timers.map((timer) => {
              if (!timer.isRunning) {
                return timer;
              }
              if (timer.isPaused) {
                // Timer is paused, update the endAt value
                const endAt = currentTime + timer.timeLeft;
                return { ...timer, endAt };
              }
              const timeLeft = timer.endAt - currentTime;
              if (timeLeft <= 0) {
                // Timer has ended

                set({ lastEnded: timer.id });
                return { ...timer, timeLeft: 0 };
              }
              return { ...timer, timeLeft };
            });

            return { timers: updatedTimers };
          });
        }, 1000);
        return intervalId;
      },
      setMaximize: (maximize: string) => {
        set({ maximize });
        if (maximize) set({ minimizedInput: true });
      },
      setLastEnded: (lastEnded: string) => set({ lastEnded }),

      setMinimizedInput: (minimizedInput: boolean) => set({ minimizedInput }),
    }),
    {
      name: "timer-storage", // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Custom hook to access the timers store
 * @returns timers store
 */
export const useTimersStore = () => {
  return zustandTimersStore(
    useShallow((state: any) => ({
      timers: state.timers,
      maximize: state.maximize,
      lastEnded: state.lastEnded,
      minimizedInput: state.minimizedInput,
      getTimer: state.getTimer,
      setTimers: state.setTimers,
      addTimer: state.addTimer,
      delTimer: state.delTimer,
      updateTimer: state.updateTimer,
      startTimers: state.startTimers,
      setMaximize: state.setMaximize,
      setLastEnded: state.setLastEnded,
      setMinimizedInput: state.setMinimizedInput,
    }))
  );
};
/**
 * Custom hook to start timers and filter out timers older than 24 hours
 * @returns void
 */
export const useAndStartTimers = () => {
  const { startTimers, timers, setTimers } = zustandTimersStore(
    (state: any) => ({
      timers: state.timers,
      setTimers: state.setTimers,
      startTimers: state.startTimers,
    })
  );
  useEffect(() => {
    if (timers && timers.length > 0) {
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const filteredTimers = timers.filter(
        (timer: Timer) => timer !== null && timer.endAt > twentyFourHoursAgo
      );

      console.log(
        "Filtered timers:",
        filteredTimers.length,
        "out of",
        timers.length
      );
      if (filteredTimers.length !== timers.length) setTimers(filteredTimers);
    }
  }, []);

  useEffect(() => {
    const timerId = startTimers();

    return () => {
      clearInterval(timerId);
    };
  }, []);
};
