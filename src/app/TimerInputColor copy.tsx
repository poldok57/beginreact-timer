import React, { useRef, useState, useEffect } from "react";
import { filesetVariants, lengendVariants } from "../style/form-variants";
import { myThemeColors } from "../../tailwind.config";
import { GithubPicker, SliderPicker } from "react-color";
import { Timer } from "../types/timer";
import { X, Copy } from "lucide-react";

const themeColorsArray = ["#fff", "#000", ...Object.values(myThemeColors)];

const DisplayColorPicker = ({
  setColor,
  color,
  fieldName,
  label,
  closeColorPicker,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const handleCopyColor = () => {
    navigator.clipboard.writeText(color);
    console.log("Color copied to clipboard", color);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        closeColorPicker();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="absolute flex flex-col items-center z-10  -translate-y-full w-fit gap-3 p-2 bg-white rounded-lg border border-base-200"
      ref={pickerRef}
      // onMouseLeave={() => closeColorPicker()}
    >
      {label ? (
        <h3 className="flex justify-center text-lg font-bold">{label}</h3>
      ) : null}
      <div className="form-control w-44">
        <label htmlFor={fieldName} className="flex gap-2 items-center">
          <input
            id={fieldName}
            type="checkbox"
            className="toggle toggle-success toggle-sm"
            checked={color === "transparent"}
            onChange={(e) =>
              setColor(fieldName, e.target.checked ? "transparent" : "#888")
            }
          />
          <span className="text-primary">Transparent</span>
        </label>
      </div>
      {color !== "transparent" && (
        <>
          Standard colors
          <GithubPicker
            width="220px"
            onChange={(color) => setColor(fieldName, color.hex)}
          />
          Theme colors
          <GithubPicker
            width="220px"
            colors={themeColorsArray}
            onChange={(color) => setColor(fieldName, color.hex)}
          />
          <SliderPicker
            color={color}
            disableAlpha={true}
            onChange={(color) => setColor(fieldName, color.hex)}
          />
          <div className="relative flex gap-2 items-center">
            <input
              type="text"
              className="border  border-gray-300 w-11/12 m-2 focus:border-gray-800 p-3 rounded-md"
              value={color}
              onChange={(e) => setColor(fieldName, e.target.value)}
            />
            <button
              className="btn btn-sm absolute right-2 p-2 m-2"
              onClick={handleCopyColor}
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

interface InputColorProps {
  fieldName: string;
  color: string;
  label?: string;
  withLabel?: boolean;
  setColor: (fieldName: string, value: string) => void;
}

export const InputColor: React.FC<InputColorProps> = ({
  fieldName,
  color,
  label = null,
  withLabel = true,
  setColor,
}) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  return (
    <div>
      {withLabel && label && <label className="block text-sm">{label}</label>}
      <div
        className="w-8 h-6 m-2 bg-gray-500 cursor-pointer border-4 border-gray-300 rounded-md"
        style={{ backgroundColor: color }}
        onClick={() => setShowColorPicker(true)}
        title={label}
      ></div>
      {showColorPicker && (
        <DisplayColorPicker
          setColor={setColor}
          color={color}
          fieldName={fieldName}
          label={label}
          closeColorPicker={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};

interface TimerInputColorProps {
  timer: Timer;
  setColor: (fieldName: string, value: string) => void;
  onClose?: () => void | null;
  withLabel?: boolean;
}

export const TimerInputColor: React.FC<TimerInputColorProps> = ({
  timer,
  setColor,
  onClose = null,
  withLabel = true,
}) => {
  return (
    <fieldset
      className={filesetVariants({
        bg: "base200",
        flex: "rowNoGap",
        className: "relative",
      })}
    >
      {onClose && (
        <button
          className="btn btn-sm border border-warning absolute -top-7 right-0 p-2"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      )}
      <legend className={lengendVariants({ size: "sm" })}>Timer color</legend>
      <InputColor
        key="pageColor"
        fieldName="pageColor"
        color={timer.pageColor}
        setColor={setColor}
        label="Page"
        withLabel={withLabel}
      />
      <InputColor
        key="bgColor"
        fieldName="bgColor"
        color={timer.bgColor}
        setColor={setColor}
        label="Back-gr."
        withLabel={withLabel}
      />
      <InputColor
        key="timeColor"
        fieldName="timeColor"
        color={timer.timeColor}
        setColor={setColor}
        label="Timer"
        withLabel={withLabel}
      />
      <InputColor
        key="textColor"
        fieldName="textColor"
        color={timer.textColor}
        setColor={setColor}
        label="Text"
        withLabel={withLabel}
      />
      <InputColor
        key="pauseColor"
        fieldName="pauseColor"
        color={timer.pauseColor}
        setColor={setColor}
        label="Pause"
        withLabel={withLabel}
      />
    </fieldset>
  );
};
