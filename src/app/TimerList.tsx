"use client";
import React, { useRef, useEffect, useState, use } from "react";
import { useTimerStore, useTimerActions } from "../hooks/zustand/timers";
import { TimerDisplay } from "./TimerDisplay";
import { Timer } from "../types/timer";
import { Timer as LucideTimer } from "lucide-react";

export const TimerList = () => {
  const { timers, maximize, minimizedInput } = useTimerStore();
  const { setMinimizedInput } = useTimerActions();
  const now = Date.now();

  const ref = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // ou un loader si nécessaire
  }

  // console.log("timers", timers);

  const maximizedTimer =
    timers && timers.length && maximize
      ? timers.find((timer: Timer) => timer && timer.id === maximize)
      : null;

  const minimizedTimers =
    timers && timers.filter((timer: Timer) => timer && timer.isMinimized);

  const otherTimers = timers.filter(
    (timer: Timer) => timer && !timer.isMinimized && timer.id !== maximize
  );

  return (
    <div className="relative z-0 max-w-fit justify-center">
      {minimizedInput || (minimizedTimers && minimizedTimers.length) ? (
        <div ref={ref} className="fixed items-center bottom-0   left-0 w-48">
          {minimizedInput ? (
            <div className="flex flex-col items-center text-success-content p-1">
              <button
                className="btn btn-success btn-lg w-full"
                onClick={() => setMinimizedInput(false)}
              >
                <LucideTimer size={24} />
                Add a timer
              </button>
            </div>
          ) : null}
          {minimizedTimers
            .sort((a: Timer, b: Timer) => {
              const remainingTimeA = a.endAt - now;
              const remainingTimeB = b.endAt - now;
              if (remainingTimeA < 0 && remainingTimeB < 0)
                return a.duration - b.duration; // Les deux timers sont passés, ne change pas l'ordre
              if (remainingTimeA < 0) return 1; // A est passé, B vient en premier
              if (remainingTimeB < 0) return -1; // B est passé, A vient en premier
              return remainingTimeA - remainingTimeB; // Compare par temps restant
            })
            .map((timer: Timer) => (
              <TimerDisplay timer={timer} key={timer.id} />
            ))}
        </div>
      ) : null}
      {maximizedTimer ? (
        <div
          ref={ref}
          className="flex flex-col items-center mx-auto w-fit mb-2"
        >
          <TimerDisplay timer={maximizedTimer} key={maximizedTimer.id} />
        </div>
      ) : (
        <></>
      )}

      <div
        ref={ref}
        className="grid grid-cols-1 gap-2 lg:gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {otherTimers.map((timer: Timer) => (
          <TimerDisplay key={timer.id} timer={timer} />
        ))}
      </div>
    </div>
  );
};
