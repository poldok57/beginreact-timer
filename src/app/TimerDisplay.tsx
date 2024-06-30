"use client";
import { useState, useEffect } from "react";
import { useTimersStore } from "../hooks/zustand/timers";
import { Timer } from "../types/timer";
import {
  X,
  Pause,
  Play,
  RotateCcw,
  PanelBottom,
  Timer as LucideTimer,
} from "lucide-react";

import { CountdownTimer } from "../components/timer/CountdownTimer";
import { formatDuration } from "../lib/timer/formatDuration";
import { format } from "path";

interface TimerDisplayProps {
  timer: Timer;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
  const { delTimer, updateTimer } = useTimersStore();
  const [timerEnd, setTimerEnd] = useState(
    new Date(timer.endAt).toLocaleTimeString()
  );
  const updateTimerEnd = (newEnd: number) => {
    setTimerEnd(new Date(newEnd).toLocaleTimeString());
  };

  if (timer.isPaused) {
    timer.endAt = Date.now() + timer.timeLeft;
  } else {
    timer.timeLeft = timer.endAt - Date.now();
    if (timer.timeLeft <= 0) {
      timer.isPaused = true;
      timer.timeLeft = 0;
    }
  }

  const [timeLeft, setTimeLeft] = useState(timer.timeLeft);

  // const deleteTimer = () => {
  //   delTimer(timer.id);
  // };

  const setPaused = (paused: boolean) => {
    if (!paused) {
      timer.endAt = Date.now() + timer.timeLeft;
    }
    timer.isPaused = paused;
    updateTimer(timer.id, timer);
  };

  const toggleMinimized = () => {
    timer.isMinimized = !timer.isMinimized;
    updateTimer(timer.id, timer);
  };

  const restartTimer = () => {
    timer.endAt = Date.now() + timer.duration * 1000;
    timer.isPaused = false;
    updateTimer(timer.id, timer);
    updateTimerEnd(timer.endAt);
    // console.log("Timer restarted", timer);
  };

  useEffect(() => {
    if (timer.timeLeft <= 0) {
      // console.log("Timer is done", timer);

      timer.isPaused = true;
      timer.timeLeft = 0;
      return;
    }
    const interval = setInterval(() => {
      if (timer.isPaused) {
        timer.endAt = Date.now() + timer.timeLeft;
        updateTimerEnd(timer.endAt);
        return;
      }
      timer.timeLeft = timer.endAt - Date.now();
      if (timer.timeLeft <= 0) {
        timer.isPaused = true;
        timer.timeLeft = 0;
        clearInterval(interval);
      }
      setTimeLeft(timer.timeLeft);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, timerEnd]);

  return (
    <div className="group card w-fit border border-neutral">
      <div className="absolute flex flex-row gap-1 right-1 top-1">
        <button
          onClick={() => toggleMinimized()}
          className=" btn btn-square btn-sm  opacity-10 group-hover:opacity-100"
        >
          {timer.isMinimized ? <LucideTimer /> : <PanelBottom />}
        </button>
        <button className="btn btn-square btn-sm  opacity-10 group-hover:opacity-100">
          <X onClick={() => delTimer(timer.id)} />
        </button>
      </div>
      <div className="card-body items-center text-center p-2">
        {timer.isMinimized ? (
          <p className="flex flex-row p-4">
            {timer.title ? timer.title : "Timer "} -{" : "}
            <LucideTimer size={20} />
            {formatDuration(timer.timeLeft / 1000)}
          </p>
        ) : (
          <>
            <h2 className="card-title">
              <LucideTimer size={20} />
              {timer.title ? timer.title : "Timer Display"}
            </h2>
            <CountdownTimer
              baseColor="#ddd"
              remainingColor="#f00"
              diameter={200}
              totalDuration={timer.duration}
              endTime={timerEnd}
              remainingTime={Math.max(timer.timeLeft, 0) / 1000}
              isPaused={timer.isPaused}
              strokeWidth={6}
            />
            <div className="absolute bottom-1 right-1">
              {timer.timeLeft <= 0 ? (
                <button onClick={() => restartTimer()}>
                  <RotateCcw size={20} />
                </button>
              ) : (
                <button onClick={() => setPaused(!timer.isPaused)}>
                  {timer.isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
