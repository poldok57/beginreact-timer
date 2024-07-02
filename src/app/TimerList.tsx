import React, { useRef, useEffect, useState } from "react";
import { useTimersStore } from "../hooks/zustand/timers";
import { TimerDisplay } from "./TimerDisplay";
import { Timer } from "../types/timer";

export const TimerList = () => {
  const { timers } = useTimersStore();
  const ref = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // ou un loader si nécessaire
  }

  return (
    <div className="max-w-fit justify-center">
      {timers.filter((timer: Timer) => timer.isLarge).length > 0 ? (
        <div
          ref={ref}
          className="flex flex-col items-center mx-auto w-fit mb-2"
        >
          {timers
            .filter((timer: Timer) => timer.isLarge)
            .sort((a: Timer, b: Timer) => b.endAt - a.endAt)
            .map((timer: Timer) => (
              <div key={timer.id} className="flex flex-col items-center">
                <TimerDisplay timer={timer} />
              </div>
            ))}
        </div>
      ) : (
        <></>
      )}

      <div
        ref={ref}
        className="grid grid-cols-1 gap-2 lg:gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {timers
          .filter((timer: Timer) => !(timer.isMinimized || timer.isLarge))
          .map((timer: Timer) => (
            <div key={timer.id} className="flex flex-col items-center">
              <TimerDisplay timer={timer} />
            </div>
          ))}
      </div>

      {timers.filter((timer: Timer) => timer.isMinimized).length > 0 ? (
        <div ref={ref} className="fixed items-center bottom-0 left-0 w-48">
          {timers
            .filter((timer: Timer) => timer.isMinimized)
            .sort((a: Timer, b: Timer) => b.endAt - a.endAt)
            .map((timer: Timer) => (
              <div key={timer.id} className="flex flex-col items-center">
                <TimerDisplay timer={timer} />
              </div>
            ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
