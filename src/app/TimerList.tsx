"use client";
import React, { useRef } from "react";
import { useTimersStore } from "../hooks/zustand/timers";
import { TimerDisplay } from "./TimerDisplay";

export const TimerList = () => {
  const { timers } = useTimersStore();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="max-w-fit">
      <div
        ref={ref}
        className="grid grid-cols-1 gap-2 lg:gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {timers.map((timer) => (
          <div key={timer.id} className="flex flex-col items-center">
            <TimerDisplay timer={timer} />
          </div>
        ))}
      </div>
    </div>
  );
};
