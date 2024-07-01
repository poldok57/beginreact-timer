import React, { useRef, useEffect, KeyboardEvent } from "react";
import { filesetVariants, lengendVariants } from "../style/form-variants";

interface TimerInputNameProps {
  timerName: string;
  onChange: (value: string) => void;
  handleValide: () => void;
  focus?: boolean;
}

export const TimerInputName: React.FC<TimerInputNameProps> = ({
  timerName,
  onChange,
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
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);

  return (
    <fieldset className={filesetVariants({ bg: "base200" })}>
      <legend className={lengendVariants({ size: "sm" })}>Timer name</legend>
      <input
        ref={inputRef}
        className="rounded-md items-center w-40"
        type="text"
        value={timerName}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleValide}
      />
    </fieldset>
  );
};
