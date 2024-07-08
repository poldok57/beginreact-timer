import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { filesetVariants, lengendVariants } from "../style/form-variants";
import { SketchPicker } from "react-color";
import { Timer } from "../types/timer";
import { X } from "lucide-react";

interface InputColorProps {
  fieldName: string;
  color: string;
  label?: string;
  setColor: (fieldName: string, value: string) => void;
}

export const InputColor: React.FC<InputColorProps> = ({
  fieldName,
  color,
  label = null,
  setColor,
}) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      {label && <label className="block text-sm">{label}</label>}
      <div
        className="w-8 h-6 m-2 bg-gray-500 cursor-pointer border border-gray-300 rounded-md"
        style={{ backgroundColor: color }}
        onClick={() => setShowColorPicker(true)}
      ></div>
      {showColorPicker && (
        <div
          className="absolute z-10"
          ref={pickerRef}
          onMouseLeave={() => setShowColorPicker(false)}
        >
          <SketchPicker
            color={color}
            onChange={(color) => setColor(fieldName, color.hex)}
          />
        </div>
      )}
    </div>
  );
};

interface TimerInputColorProps {
  timer: Timer;
  setColor: (fieldName: string, value: string) => void;
  onClose?: () => void | null;
}

export const TimerInputColor: React.FC<TimerInputColorProps> = ({
  timer,
  setColor,
  onClose = null,
}) => {
  return (
    <fieldset
      className={filesetVariants({
        bg: "base200",
        flex: "row",
        className: "relative",
      })}
    >
      {onClose && (
        <button
          className="btn btn-xs absolute -top-4 right-0 p-2"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      )}
      <legend className={lengendVariants({ size: "sm" })}>Timer color</legend>
      <InputColor
        key="bgColor"
        fieldName="bgColor"
        color={timer.bgColor}
        setColor={setColor}
        label="Background"
      />
      <InputColor
        key="pageColor"
        fieldName="pageColor"
        color={timer.pageColor}
        setColor={setColor}
        label="Page"
      />
      <InputColor
        key="timerColor"
        fieldName="timerColor"
        color={timer.timerColor}
        setColor={setColor}
        label="Timer"
      />
      <InputColor
        key="textColor"
        fieldName="textColor"
        color={timer.textColor}
        setColor={setColor}
        label="Text"
      />
      <InputColor
        key="pauseColor"
        fieldName="pauseColor"
        color={timer.pauseColor}
        setColor={setColor}
        label="Pause"
      />
    </fieldset>
  );
};
