"use client";
import { useState, useEffect, use } from "react";
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
  Palette,
  MessageSquareOff,
} from "lucide-react";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../components/atom/Dialog";
import { CountdownTimer } from "../components/timer/CountdownTimer";
import { formatDuration } from "../lib/timer/formatDuration";
import { sendNotification } from "../lib/timer/sendNotification";

import { TimerInputName } from "./TimerInputName";
import { TimerInputColor } from "./TimerInputColor";

interface TimerDisplayProps {
  timer: Timer;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
  const { delTimer, getTimer, updateTimer } = useTimersStore();
  const [isEditing, setEditing] = useState(false);
  const [dateNow, setDateNow] = useState(Date.now());

  const [showInputColor, setShowInputColor] = useState(false);

  const togglePaused = () => {
    timer.isPaused = !timer.isPaused;
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

  const setColor = (fieldName: string, value: string) => {
    timer = { ...timer, [fieldName]: value };
    updateTimer(timer.id, timer);
  };

  const restartTimer = () => {
    timer.endAt = Date.now() + timer.duration * 1000;
    timer.timeLeft = timer.duration * 1000;
    timer.isPaused = false;
    timer.isRunning = true;
    updateTimer(timer.id, timer);
  };
  timer = getTimer(timer.id);

  const timerEnd = new Date(timer.endAt).toLocaleTimeString();
  // console.log("Timer end:", timerEnd, "time left:", timer.timeLeft);

  const maxDiameter = window.innerWidth - 80;
  // console.log("Screen width:", screenWidth);

  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      setDateNow(Date.now());
      // console.log("Timer:", timer.title, "time left:", timer.timeLeft / 1000);

      if (timer.timeLeft <= 0 && timer.isRunning) {
        timer.isPaused = true;
        timer.isRunning = false;
        timer.timeLeft = 0;
        updateTimer(timer.id, timer);
        sendNotification({ title: timer.title ?? "Timer" });
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer.endAt, timer.isPaused, timer.timeLeft, timer.isRunning, dateNow]);

  return (
    <div
      className={clsx("group card border border-neutral", {
        "p-1 rounded-sm w-full z-1": timer.isMinimized,
        "bg-base-100 w-fit z-0": !timer.isMinimized,
      })}
      style={{ backgroundColor: timer.pageColor }}
    >
      <div className="absolute flex flex-row gap-1 right-1 top-1">
        {!timer.isMinimized ? (
          <>
            <button className="btn btn-square btn-sm  opacity-10 group-hover:opacity-100">
              <Palette
                size={16}
                onClick={() => {
                  setShowInputColor(!showInputColor);
                  setEditing(false);
                }}
              />
            </button>
            <button
              onClick={() => toggleMinimized()}
              className="btn btn-square btn-sm  opacity-10 group-hover:opacity-100"
            >
              {timer.isMinimized ? <LucideTimer /> : <PanelBottom size={16} />}
            </button>
          </>
        ) : null}
        <div className="w-8">
          <Dialog>
            <DialogTrigger
              type="open"
              className="btn btn-square btn-sm opacity-10 group-hover:opacity-100"
            >
              <X size={16} />
            </DialogTrigger>
            <DialogContent
              position="over"
              blur={false}
              className="w-fit border border-base-300 bg-base-200 p-2 m-1 gap-2 rounded"
            >
              <div>
                <button
                  className="btn btn-square btn-sm  opacity-10 group-hover:opacity-100"
                  onClick={() => delTimer(timer.id)}
                >
                  <X size={16} />
                </button>
                <DialogTrigger
                  type="close"
                  className="btn btn-square btn-sm opacity-10 group-hover:opacity-100"
                >
                  <MessageSquareOff size={16} />
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {timer.isMinimized ? (
        <div
          className="flex flex-row p-1 w-full justify-between cursor-pointer"
          onClick={() => toggleMinimized()}
        >
          <div
            className="flex flex-row truncate"
            style={{ color: timer.textColor }}
          >
            {timer.title ? timer.title : "Timer "}
          </div>
          <div
            className="flex flex-row font-mono"
            style={{ color: timer.textColor }}
          >
            {timer.isPaused ? <Pause size={20} /> : <LucideTimer size={20} />}{" "}
            {formatDuration(timer.timeLeft / 1000)}
          </div>
        </div>
      ) : (
        <div className="card-body items-center p-2">
          {showInputColor && (
            <div className="absolute -translate-y-10">
              <TimerInputColor
                timer={timer}
                setColor={setColor}
                withLabel={false}
                onClose={() => setShowInputColor(false)}
              />
            </div>
          )}
          {isEditing ? (
            <div className="absolute -translate-y-10">
              <TimerInputName
                timerName={timer.title}
                focus={true}
                onChange={(newName) => {
                  timer.title = newName;
                  updateTimer(timer.id, timer);
                }}
                onClose={() => setEditing(false)}
                handleValide={() => setEditing(false)}
              />
            </div>
          ) : null}
          <h2 className="card-title w-full">
            <div
              className={clsx(
                "flex flex-row w-full cursor-pointer items-center border-neutral",
                {
                  "text-lg justify-start": !timer.isLarge,
                  "text-xl justify-center": timer.isLarge,
                }
              )}
              style={{ color: timer.textColor }}
              onClick={() => {
                setEditing(true);
                setShowInputColor(false);
              }}
            >
              <LucideTimer size={20} />{" "}
              {timer.title ? timer.title : "Timer Display"}
            </div>
          </h2>
          <CountdownTimer
            bgColor={timer.bgColor}
            timeColor={timer.timeColor}
            pauseColor={timer.pauseColor}
            textColor={timer.textColor}
            diameter={timer.isLarge ? Math.min(maxDiameter, 600) : 200}
            totalDuration={timer.duration}
            endTime={timerEnd}
            remainingTime={Math.max(timer.timeLeft, 0) / 1000}
            isPaused={timer.isPaused}
          />
          <div className="absolute bottom-1 left-1  opacity-0 group-hover:opacity-90">
            <button className="btn btn-xs" onClick={() => toggleLarge()}>
              {timer.isLarge ? <Shrink size={20} /> : <Expand size={20} />}
            </button>
          </div>
          <div className="absolute bottom-1 right-1 opacity-0 flex gap-1 group-hover:opacity-90">
            {timer.timeLeft <= 0 || timer.isPaused ? (
              <button className="btn btn-xs" onClick={() => restartTimer()}>
                <RotateCcw size={20} />
              </button>
            ) : null}
            {timer.timeLeft > 0 ? (
              <button className="btn btn-xs" onClick={() => togglePaused()}>
                {timer.isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
