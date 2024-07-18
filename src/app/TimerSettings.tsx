import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { FieldLegend } from "./FieldLegend";
import clsx from "clsx";

interface TimerSettingsProps {
  timerName: string;
  onChange: (value: string) => void;
  onClose?: () => void;
  handleValide: () => void;
  focus?: boolean;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  timerName,
  onChange,
  onClose = null,
  handleValide,
  focus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleValide();
    }
  };

  useEffect(() => {
    if (!focus || !inputRef.current) return;

    inputRef.current.focus();
  }, [focus]);

  return (
    <FieldLegend title="Settings" onClose={onClose}>
      <div className="flex w-fit">
        <label className="label cursor-pointer">
          <span className="label-text">Auto restart</span>
          <input type="checkbox" className="toggle toggle-primary" />
        </label>
      </div>
      <input
        ref={inputRef}
        className={clsx("rounded-md items-center", {
          "w-full": !focus,
          "w-40": focus,
        })}
        type="text"
        value={timerName}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleValide}
      />
    </FieldLegend>
  );
};
