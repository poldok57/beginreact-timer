import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { fieldsetVariants, lengendVariants } from "../style/form-variants";
import { hiddenBtnVariants } from "../style/form-variants";
import { FieldLegend } from "./FieldLegend";
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
    if (!focus || !inputRef.current) return;

    inputRef.current.focus();
  }, [focus]);

  return (
    <FieldLegend title="Timer name" onClose={onClose}>
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
