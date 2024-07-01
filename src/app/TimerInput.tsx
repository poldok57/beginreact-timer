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
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTime: Time = controleTime({ ...time, [name]: value });

    setTime(controleTime(newTime));
  };
  const { addTimer } = useTimersStore();

  const saveTimer = () => {
    const { h, m, s } = time;
    const duration = Number(h) * 3600 + Number(m) * 60 + Number(s);
    const newTimer = {
      id: Date.now().toString(),
      duration,
      timeLeft: duration,
      endAt: Date.now() + duration * 1000,
      isRunning: false,
      isMinimized: false,
      title: timerName,
    };
    addTimer(newTimer);
  };

  useFocusTrap(ref);

  return (
    <div class="card border rounded-md shadow-lg border-base-300">
      <div class="card-title text-xl justify-center text-neutral p-2">
        Timer
      </div>
      <div class="card-body p-2">
        <div className="flex flex-col">
          <fieldset ref={ref} className={filesetVariants({ bg: "base200" })}>
            <legend className={lengendVariants({ size: "sm" })}>
              Timer duration
            </legend>
            <div className="flex flex-row">
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
        </div>
      </div>
      <div class="card-actions flex flex-row justify-between px-4 pb-4 gap-4">
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
