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
  Expand,
  Shrink,
  Timer as LucideTimer,
} from "lucide-react";
import clsx from "clsx";

import { CountdownTimer } from "../components/timer/CountdownTimer";
import { formatDuration } from "../lib/timer/formatDuration";
import { sendNotification } from "../lib/timer/sendNotification";

import { TimerInputName } from "./TimerInputName";
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

  const [isEditing, setIsEditing] = useState(false);
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
    timer.isLarge = false;
    updateTimer(timer.id, timer);
  };
  const toggleLarge = () => {
    timer.isLarge = !timer.isLarge;
    updateTimer(timer.id, timer);
  };

  const restartTimer = () => {
    timer.endAt = Date.now() + timer.duration * 1000;
    timer.isPaused = false;
    updateTimer(timer.id, timer);
    updateTimerEnd(timer.endAt);
    // console.log("Timer restarted", timer);
  };

  const maxWidth = window.innerWidth - 50;
  // console.log("Screen width:", screenWidth);

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
        sendNotification({ title: timer.title ?? "Timer" });
      }
      setTimeLeft(timer.timeLeft);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, timerEnd]);

  return (
    <div
      className={clsx("group card w-full border border-neutral", {
        "p-1 rounded-sm bg-base-200": timer.isMinimized,
        "bg-base-100": !timer.isMinimized,
      })}
    >
      <div className="absolute flex flex-row gap-1 right-1 top-1">
        <button
          onClick={() => toggleMinimized()}
          className=" btn btn-square btn-sm  opacity-10 group-hover:opacity-100"
        >
          {timer.isMinimized ? <LucideTimer /> : <PanelBottom size={16} />}
        </button>
        <button className="btn btn-square btn-sm  opacity-10 group-hover:opacity-100">
          <X onClick={() => delTimer(timer.id)} size={16} />
        </button>
      </div>
      {timer.isMinimized ? (
        <div className="flex flex-row p-2 w-full justify-between">
          <div className="flex flex-row truncate">
            {timer.title ? timer.title : "Timer "}
          </div>
          <div className="flex flex-row">
            {timer.isPaused ? <Pause size={20} /> : <LucideTimer size={20} />}{" "}
            {formatDuration(timer.timeLeft / 1000)}
          </div>
        </div>
      ) : (
        <div className="card-body items-center p-2">
          {isEditing ? (
            <TimerInputName
              timerName={timer.title}
              focus={true}
              onChange={(newName) => {
                timer.title = newName;
                updateTimer(timer.id, timer);
              }}
              handleValide={() => setIsEditing(false)}
            />
          ) : (
            <h2 className="card-title w-full">
              <div
                className="flex flex-row cursor-pointer items-center text-left justify-start"
                onClick={() => setIsEditing(true)}
              >
                <LucideTimer size={20} />{" "}
                {timer.title ? timer.title : "Timer Display"}
              </div>
            </h2>
          )}
          <CountdownTimer
            baseColor="#ddd"
            remainingColor="#f00"
            diameter={timer.isLarge ? Math.min(maxWidth, 500) : 200}
            totalDuration={timer.duration}
            endTime={timerEnd}
            remainingTime={Math.max(timer.timeLeft, 0) / 1000}
            isPaused={timer.isPaused}
            strokeWidth={timer.isLarge ? 10 : 6}
          />
          <div className="absolute bottom-1 left-1">
            <button onClick={() => toggleLarge()}>
              {timer.isLarge ? <Shrink size={20} /> : <Expand size={20} />}
            </button>
          </div>
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
        </div>
      )}
    </div>
  );
};
