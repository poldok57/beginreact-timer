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

import { hiddenBtnVariants } from "../style/form-variants";

interface TimerDisplayProps {
  key: string;
  timer: Timer;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer, key }) => {
  const { updateTimer, maximize, lastEnded, setLastEnded, setMaximize } =
    useTimersStore();
  const [isEditing, setEditing] = useState(false);

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

    if (timer.id === lastEnded) {
      setLastEnded("");
    }
  };
  // timer = getTimer(timer.id);

  const timerEnd = timer.isRunning
    ? new Date(timer.endAt).toLocaleTimeString()
    : "";

  const isLarge = timer.id === maximize;
  const btnSize = isLarge ? 30 : 18;

  const diameter = isLarge
    ? Math.min(window.innerWidth - 60, window.innerHeight - 100, 900)
    : 200;

  useEffect(() => {
    if (timer.timeLeft > 0) return;

    if (!timer.isRunning) {
      //timer ready to start
      timer.timeLeft = timer.duration * 1000;
      updateTimer(timer.id, timer);
    }

    if (timer.timeLeft <= 0 && timer.isRunning) {
      timer.isRunning = false;
      updateTimer(timer.id, timer);
      sendNotification({ title: timer.title ?? "Timer" });
    }
  }, [timer.endAt, timer.isPaused, timer.timeLeft, timer.isRunning]);

  if (timer.isMinimized) {
    return MinimizedTimerDisplay({ timer, key });
  }
  return (
    <div
      key={key}
      className={clsx([
        "group card border border-neutral",
        "bg-base-100 w-fit z-0",
        {
          "border-3 outline-4 outline-offset-2 outline-double outline-red-400 border-red-600":
            timer.id === lastEnded,
        },
      ])}
      style={{
        backgroundColor: timer.pageColor,
      }}
    >
      <div className="absolute flex flex-row gap-1 right-1 top-1">
        <Dialog blur={true}>
          <DialogTrigger type="open">
            <button className={hiddenBtnVariants({ size: "sm" })}>
              <Palette
                size={16}
                onClick={() => {
                  setEditing(false);
                }}
              />
            </button>
          </DialogTrigger>
          <DialogContent position="center">
            <TimerInputColor
              timer={timer}
              setColor={setColor}
              withLabel={false}
              withTemplate={true}
              closeOnOutsideClick={true}
            />
          </DialogContent>
        </Dialog>

        <button
          onClick={() => setMinimized()}
          className={hiddenBtnVariants({ size: "sm" })}
        >
          <PanelBottom size={16} />
        </button>
        <CloseButton id={timer.id} />
      </div>
      <div className="card-body items-center p-1">
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
              "flex flex-row w-full justify-center cursor-pointer items-center border-neutral transition-all  duration-700",
              {
                "text-lg group-hover:justify-start": !isLarge,
                "text-xl": isLarge,
              }
            )}
            style={{ color: timer.textColor }}
            onClick={() => {
              setEditing(true);
            }}
          >
            <LucideTimer size={btnSize} />{" "}
            {timer.title ? timer.title : "Timer Display"}
          </div>
        </h2>
        <div className="relative flex h-fit justify-center items-center">
          <CountdownTimer
            bgColor={timer.bgColor}
            timeColor={timer.timeColor}
            pauseColor={timer.pauseColor}
            textColor={timer.textColor}
            diameter={diameter}
            totalDuration={timer.duration}
            endTime={timerEnd}
            remainingTime={Math.max(timer.timeLeft, 0) / 1000}
            isPaused={timer.isPaused}
          />
          {timer.isPaused || !timer.isRunning ? (
            <div
              className={clsx(
                "absolute opacity-40 group-hover:opacity-90 transition-opacity",
                {
                  "translate-y-44": diameter >= 500,
                  "translate-y-28": diameter >= 270 && diameter < 500,
                  "translate-y-16": diameter < 270,
                }
              )}
            >
              <button
                className={clsx("btn btn-success", {
                  "h-fit p-5": diameter >= 500,
                  "h-fit p-3": diameter >= 270 && diameter < 500,
                  "btn-sm": !isLarge || diameter < 270,
                })}
                onClick={() => {
                  timer.isRunning ? togglePaused() : restartTimer();
                }}
              >
                <Play size={diameter >= 500 ? 60 : diameter >= 270 ? 40 : 20} />
              </button>
            </div>
          ) : null}
          <div className="absolute bottom-0 left-0 flex">
            <button
              className={hiddenBtnVariants({ size: isLarge ? "md" : "sm" })}
              onClick={() => toggleLarge()}
            >
              {isLarge ? <Shrink size={btnSize} /> : <Expand size={btnSize} />}
            </button>
          </div>

          <div className="absolute bottom-0 right-0 flex gap-1">
            {timer.isRunning && timer.isPaused ? (
              <button
                className={hiddenBtnVariants({ size: isLarge ? "md" : "sm" })}
                onClick={() => restartTimer()}
              >
                <RotateCcw size={btnSize} />
              </button>
            ) : null}
            {timer.isRunning ? (
              <button
                className={hiddenBtnVariants({ size: isLarge ? "md" : "sm" })}
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

      {/* Open the modal using document.getElementById('ID').showModal() method */}
    </div>
  );
};

type CloseButtonProps = {
  id: string;
};

const CloseButton: React.FC<CloseButtonProps> = ({ id }) => {
  const { delTimer } = useTimersStore();
  return (
    <div className="w-8">
      <Dialog blur={false}>
        <DialogTrigger
          type="open"
          className={hiddenBtnVariants({ size: "sm", opacity: "10" })}
        >
          <X size={16} />
        </DialogTrigger>
        <DialogContent
          position="over"
          className="w-fit border border-base-300 bg-base-200 p-2 m-1 gap-2 rounded"
        >
          <button
            className={hiddenBtnVariants({ size: "sm", opacity: "60" })}
            onClick={() => delTimer(id)}
          >
            <X size={16} />
          </button>
          <DialogTrigger
            type="close"
            className={hiddenBtnVariants({ size: "sm", opacity: "60" })}
          >
            <MessageSquareOff size={16} />
          </DialogTrigger>
        </DialogContent>
      </Dialog>
    </div>
  );
};
/**
 * Minimized Timer Display
 */
export const MinimizedTimerDisplay: React.FC<TimerDisplayProps> = ({
  timer,
  key,
}) => {
  const { updateTimer, delTimer } = useTimersStore();
  const stopMinimized = () => {
    timer.isMinimized = false;
    updateTimer(timer.id, timer);
  };
  return (
    <div key={key} className="group relative border border-neutral w-full">
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
