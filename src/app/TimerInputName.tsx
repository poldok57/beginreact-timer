import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { filesetVariants, lengendVariants } from "../style/form-variants";
import { X } from "lucide-react";
import clsx from "clsx";

interface TimerInputNameProps {
  timerName: string;
  onChange: (value: string) => void;
  onClose?: () => void;
  handleValide: () => void;
  focus?: boolean;
}

export const TimerInputName: React.FC<TimerInputNameProps> = ({
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
    if (!focus) return;
    const timer = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [focus]);

  return (
    <fieldset className={filesetVariants({ bg: "base200", flex: "row" })}>
      <legend className={lengendVariants({ size: "sm" })}>Timer name</legend>
      {onClose && (
        <button
          className="btn btn-xs absolute top-0 right-0 p-2"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      )}
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
    </fieldset>
  );
};
