"use client";
import { useEffect } from "react";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist, createJSONStorage } from "zustand/middleware";
import { Timer } from "../../types/timer";

interface TimerState {
  timers: Timer[];
}

const zustandTimersStore = create(
  persist(
    (set, get) => ({
      timers: [],
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
          (timer: Timer) => timer.id === timerId
        );
      },
      delTimer: (timerId: string) =>
        set((state: { timers: Timer[] }) => ({
          timers: state.timers.filter((timer) => timer.id !== timerId),
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

                return { ...timer, timeLeft: 0 };
              }
              return { ...timer, timeLeft };
            });

            return { timers: updatedTimers };
          });
        }, 1000);
        return intervalId;
      },
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
      getTimer: state.getTimer,
      setTimers: state.setTimers,
      addTimer: state.addTimer,
      delTimer: state.delTimer,
      updateTimer: state.updateTimer,
      startTimers: state.startTimers,
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
    const timerId = startTimers();

    if (timers && timers.length > 0) {
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const filteredTimers = timers.filter(
        (timer: Timer) => timer !== null && timer.endAt > twentyFourHoursAgo
      );

      // console.log(
      //   "Filtered timers:",
      //   filteredTimers.length,
      //   "out of",
      //   timers.length
      // );
      // setTimers(filteredTimers);
    }

    return () => {
      clearInterval(timerId);
    };
  }, []);
};
