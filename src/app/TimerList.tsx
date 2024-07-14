"use client";
import React, { useRef, useEffect, useState, use } from "react";
import { useTimersStore } from "../hooks/zustand/timers";
import { TimerDisplay } from "./TimerDisplay";
import { Timer } from "../types/timer";

export const TimerList = () => {
  const { timers, maximize, setTimers } = useTimersStore();
  const now = Date.now();

  const ref = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // ou un loader si nécessaire
  }

  const maximizedTimer =
    timers && timers.length && maximize
      ? timers.find((timer: Timer) => timer.id === maximize)
      : null;

  const minimizedTimers =
    timers && timers.filter((timer: Timer) => timer.isMinimized);

  return (
    <div className="max-w-fit justify-center">
      {minimizedTimers && minimizedTimers.length ? (
        <div ref={ref} className="fixed items-center bottom-0 left-0 w-48">
          {minimizedTimers
            .sort((a: Timer, b: Timer) => {
              const remainingTimeA = a.endAt - now;
              const remainingTimeB = b.endAt - now;
              if (remainingTimeA < 0 && remainingTimeB < 0) return 0; // Les deux timers sont passés, ne change pas l'ordre
              if (remainingTimeA < 0) return 1; // A est passé, B vient en premier
              if (remainingTimeB < 0) return -1; // B est passé, A vient en premier
              return remainingTimeA - remainingTimeB; // Compare par temps restant
            })
            .map((timer: Timer) => (
              <div key={timer.id} className="flex flex-col items-center">
                <TimerDisplay timer={timer} />
              </div>
            ))}
        </div>
      ) : null}
      {maximizedTimer ? (
        <div
          ref={ref}
          className="flex flex-col items-center mx-auto w-fit mb-2"
        >
          <div key={maximizedTimer.id} className="flex flex-col items-center">
            <TimerDisplay timer={maximizedTimer} />
          </div>
        </div>
      ) : (
        <></>
      )}

      <div
        ref={ref}
        className="grid grid-cols-1 gap-2 lg:gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {timers
          .filter(
            (timer: Timer) => !(timer.isMinimized || timer.id === maximize)
          )
          .map((timer: Timer) => (
            <div key={timer.id} className="flex flex-col items-center">
              <TimerDisplay timer={timer} />
            </div>
          ))}
      </div>
    </div>
  );
};
