// @ts-nocheck
"use client";
import { ChangeEvent, useState, useRef } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { buttonVariants, lengendVariants } from "../style/form-variants";
import { TwoDigitInput } from "./TwoDigitInput";
import { Time } from "../types/timer";
import { useTimersStore } from "../hooks/zustand/timers";
import { filesetVariants } from "../style/form-variants";
import { TimerInputName } from "./TimerInputName";
import { TimerInputColor } from "./TimerInputColor";
import { TimerTemplate } from "./TimerTemplate";
import { myThemeColors } from "../../tailwind.config";
import { CountdownTimer } from "../components/timer/CountdownTimer";
import { PanelBottom, Palette } from "lucide-react";

type Time = {
  h: string;
  m: string;
  s: string;
};

const controleTime = (time: Time) => {
  const { h, m, s } = time;
  let newSeconds = Math.max(Number(s), 0);
  let newMinutes = Math.max(Number(m), 0);
  let newHours = Math.max(Number(h), 0);

  if (newSeconds >= 60) {
    if (newMinutes === 0) {
      newMinutes += Math.floor(newSeconds / 60);
      newSeconds %= 60;
    } else {
      newSeconds = 59;
    }
  }
  if (newMinutes >= 60) {
    if (newHours === 0) {
      newHours += Math.floor(newMinutes / 60);
      newMinutes %= 60;
    } else {
      newMinutes = 59;
    }
  }
  if (newHours >= 99) {
    newHours = 99;
  }
  const formattedMinutes = String(newSeconds).padStart(2, "0");
  const formattedSeconds = String(newMinutes).padStart(2, "0");
  const formattedHours = String(newHours).padStart(2, "0");
  return {
    h: formattedHours,
    m: formattedMinutes,
    s: formattedSeconds,
  } as Time;
};

export const TimerInput = () => {
  const ref = useRef(null);
  const [time, setTime] = useState({ h: "00", m: "01", s: "00" } as Time);
  const [timerName, setTimerName] = useState("");
  const [showInputColor, setShowInputColor] = useState<boolean>(false);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>("");
  const toggleMinimize = () => {
    setMinimizedInput(true);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTime: Time = controleTime({ ...time, [name]: value });

    setTime(controleTime(newTime));
  };
  const { addTimer, setMinimizedInput, minimizedInput } = useTimersStore();
  const myBgColor = myThemeColors["base-200"];
  const [timerData, setTimerData] = useState({
    isRunning: true,
    isPaused: false,
    isMinimized: false,
    title: "",
    bgColor: myThemeColors["base-200"],
    pageColor: myThemeColors["base-100"],
    timeColor: "#fa4",
    textColor: "#eee",
    pauseColor: "#f22",
  });

  const setColor = (fieldName: string, value: string) => {
    setTimerData({ ...timerData, [fieldName]: value });
  };

  const saveTimer = () => {
    const { h, m, s } = time;
    const duration = Number(h) * 3600 + Number(m) * 60 + Number(s);
    const newTimer: Timer = {
      ...timerData,
      id: Date.now().toString(),
      duration,
      timeLeft: duration * 1000,
      endAt: Date.now() + duration * 1000,
      isRunning: true,
      isPaused: false,
      isMinimized: false,
      title: timerName,
    };
    addTimer(newTimer);
    setMinimizedInput(true);
  };

  useFocusTrap(ref);

  return (
    <div className="fixed top-5 self-center z-[5] bg-base-100 card border rounded-md shadow-lg min-w-80 border-base-300 my-2">
      <button
        className="btn btn-xs absolute top-2 right-2"
        onClick={toggleMinimize}
      >
        <PanelBottom size={16} />
      </button>

      <div className="card-title text-xl justify-center text-neutral p-2">
        Timer
      </div>
      <div className="card-body p-2">
        <div className="flex flex-col">
          <fieldset
            ref={ref}
            className={filesetVariants({
              bg: "base200",
              className: "items-center",
            })}
          >
            <legend className={lengendVariants({ size: "sm" })}>
              Timer duration
            </legend>
            <div className="flex flex-row mx-auto justify-center">
              <TwoDigitInput
                fieldName="h"
                value={time.h}
                cut={3}
                onChange={handleInputChange}
              >
                :
              </TwoDigitInput>
              <TwoDigitInput
                fieldName="m"
                value={time.m}
                cut={3}
                onChange={handleInputChange}
              >
                :
              </TwoDigitInput>
              <TwoDigitInput
                fieldName="s"
                value={time.s}
                cut={3}
                onChange={handleInputChange}
              />
            </div>
          </fieldset>
          <TimerInputName
            timerName={timerName}
            onChange={setTimerName}
            handleValide={() => {}}
          />
          {showTemplate ? (
            <TimerTemplate
              timer={timerData}
              setTimerData={setTimerData}
              setShowInputColor={setShowInputColor}
              setShowTemplate={setShowTemplate}
              setTemplateName={setTemplateName}
              onClose={() => setShowTemplate(false)}
            />
          ) : (
            <div className="flex flex-row gap-1 justify-between w-full">
              <button
                className={buttonVariants({
                  variant: "neutral",
                  size: "lg",
                  className: "px-4",
                })}
                onClick={() => setShowTemplate(true)}
              >
                {!templateName ? (
                  "Choose a template"
                ) : (
                  <>
                    Template
                    <div
                      className="items-center flex flex-col w-fit text-xs font-normal rounded"
                      style={{
                        backgroundColor: timerData.pageColor,
                        color: timerData.timeColor,
                      }}
                    >
                      {templateName}
                      <CountdownTimer
                        diameter={30}
                        endTime="template"
                        {...timerData}
                      />
                    </div>
                  </>
                )}
              </button>
              <button
                className={buttonVariants({
                  variant: "neutral",
                  size: "lg",
                  className: "px-6",
                })}
                onClick={() => {
                  setShowInputColor(true);
                }}
              >
                <Palette size={24} />
              </button>
            </div>
          )}

          {showInputColor ? (
            <TimerInputColor
              timer={timerData}
              setColor={setColor}
              onClose={() => setShowInputColor(false)}
            />
          ) : null}
        </div>
      </div>
      <div className="card-actions flex flex-row justify-between px-4 pb-4 gap-4">
        <button
          className={buttonVariants({ variant: "warning", size: "sm" })}
          onClick={() => {
            setTime({ h: "00", m: "00", s: "00" });
            setTimerName("");
          }}
        >
          Reset
        </button>
        <button
          className={buttonVariants({ variant: "success", size: "sm" })}
          onClick={() => saveTimer()}
        >
          Add timer
        </button>
      </div>
    </div>
  );
};
