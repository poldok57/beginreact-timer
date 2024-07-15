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
  CircleCheckBig,
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
import { time } from "console";

interface TimerDisplayProps {
  timer: Timer;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
  const { delTimer, getTimer, updateTimer, maximize, setMaximize } =
    useTimersStore();
  const [isEditing, setEditing] = useState(false);
  // const [dateNow, setDateNow] = useState(Date.now());

  const [showInputColor, setShowInputColor] = useState(false);

  const togglePaused = () => {
    timer.isPaused = !timer.isPaused;
    updateTimer(timer.id, timer);
  };

  const setMinimized = () => {
    timer.isMinimized = true;
    if (maximize === timer.id) {
      setMaximize("");
    }

    updateTimer(timer.id, timer);
  };
  const toggleLarge = () => {
    if (maximize === timer.id) {
      setMaximize("");
    } else {
      setMaximize(timer.id);
    }
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
  // timer = getTimer(timer.id);

  const timerEnd = new Date(timer.endAt).toLocaleTimeString();

  const maxDiameter = window.innerWidth - 80;

  const isLarge = timer.id === maximize;
  const btnSize = isLarge ? 30 : 20;

  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      // setDateNow(Date.now());
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
  }, [timer.endAt, timer.isPaused, timer.timeLeft, timer.isRunning]);

  if (timer.isMinimized) {
    return MinimizedTimerDisplay({ timer });
  }
  return (
    <div
      className={clsx([
        "group card border border-neutral",
        "bg-base-100 w-fit z-0",
      ])}
      style={{
        backgroundColor: timer.pageColor,
      }}
    >
      <div className="absolute flex flex-row gap-1 right-1 top-1">
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
          onClick={() => setMinimized()}
          className="btn btn-square btn-sm  opacity-10 group-hover:opacity-100"
        >
          <PanelBottom size={16} />
        </button>
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
                "text-lg justify-start": !isLarge,
                "text-xl justify-center": isLarge,
              }
            )}
            style={{ color: timer.textColor }}
            onClick={() => {
              setEditing(true);
              setShowInputColor(false);
            }}
          >
            <LucideTimer size={btnSize} />{" "}
            {timer.title ? timer.title : "Timer Display"}
          </div>
        </h2>
        <div className="flex h-fit justify-center items-center">
          <CountdownTimer
            bgColor={timer.bgColor}
            timeColor={timer.timeColor}
            pauseColor={timer.pauseColor}
            textColor={timer.textColor}
            diameter={isLarge ? Math.min(maxDiameter, 600) : 200}
            totalDuration={timer.duration}
            endTime={timerEnd}
            remainingTime={Math.max(timer.timeLeft, 0) / 1000}
            isPaused={timer.isPaused}
          />
          {timer.isPaused ? (
            <div
              className={clsx("absolute opacity-40 group-hover:opacity-90", {
                "translate-y-44": isLarge,
                "translate-y-16": !isLarge,
              })}
            >
              <button
                className={clsx("btn btn-success", {
                  "h-fit p-5": isLarge,
                  "btn-sm": !isLarge,
                })}
                onClick={() => {
                  timer.isRunning ? togglePaused() : restartTimer();
                }}
              >
                {timer.isRunning ? (
                  <Play size={isLarge ? 60 : 20} />
                ) : (
                  <RotateCcw size={isLarge ? 60 : 20} />
                )}
              </button>
            </div>
          ) : null}
          <div className="absolute bottom-1 left-1  opacity-0 group-hover:opacity-90">
            <button
              className={clsx("btn", {
                "btn-md": isLarge,
                "btn-xs": !isLarge,
              })}
              onClick={() => toggleLarge()}
            >
              {isLarge ? <Shrink size={btnSize} /> : <Expand size={btnSize} />}
            </button>
          </div>

          <div className="absolute bottom-1 right-1 opacity-0 flex gap-1 group-hover:opacity-90">
            {timer.timeLeft <= 0 || timer.isPaused ? (
              <button
                className={clsx("btn", {
                  "btn-md": isLarge,
                  "btn-xs": !isLarge,
                })}
                onClick={() => restartTimer()}
              >
                <RotateCcw size={btnSize} />
              </button>
            ) : null}
            {timer.timeLeft > 0 ? (
              <button
                className={clsx("btn", {
                  "btn-md": isLarge,
                  "btn-xs": !isLarge,
                })}
                onClick={() => togglePaused()}
              >
                {timer.isPaused ? (
                  <Play size={btnSize} />
                ) : (
                  <Pause size={btnSize} />
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MinimizedTimerDisplay: React.FC<TimerDisplayProps> = ({
  timer,
}) => {
  const { updateTimer, delTimer } = useTimersStore();
  const stopMinimized = () => {
    timer.isMinimized = false;
    updateTimer(timer.id, timer);
  };
  return (
    <div className="group relative border border-neutral w-full">
      <div className="absolute  right-1 top-1 w-8">
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
      <div
        className={clsx([
          "p-2 rounded-sm w-full z-1",
          "flex flex-row items-center justify-between cursor-pointer",
        ])}
        style={{
          backgroundColor: timer.bgColor,
        }}
        onClick={() => stopMinimized()}
      >
        <div
          className="flex flex-row truncate"
          style={{ color: timer.textColor }}
        >
          {timer.title ? timer.title : "Timer "}
        </div>
        <div
          className="flex flex-row font-mono items-center"
          style={{ color: timer.textColor }}
        >
          {timer.isRunning ? (
            <>
              {timer.isPaused ? <Pause size={16} /> : <LucideTimer size={16} />}
              {" " + formatDuration(timer.timeLeft / 1000)}
            </>
          ) : (
            <>
              {"(" + formatDuration(timer.duration) + ") "}

              <CircleCheckBig size={16} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
