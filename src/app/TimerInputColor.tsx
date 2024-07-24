import React, { useRef, useState, useEffect } from "react";
import { FieldLegend } from "./FieldLegend";
import { DialogClose } from "../components/atom/Dialog";
import { CountdownTimer } from "../components/timer/CountdownTimer";
import { myThemeColors } from "../../tailwind.config";
import { GithubPicker, SliderPicker } from "react-color";
import { Timer } from "../types/timer";
import { X, Copy } from "lucide-react";
import clsx from "clsx";
import { hiddenBtnVariants } from "../style/form-variants";

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
  };
  const windowHeight = window.innerHeight;

  useEffect(() => {
    let timerId = null;

    if (!pickerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeColorPicker();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center z-20  w-fit gap-2 p-2 bg-white rounded-lg border border-base-200"
      ref={pickerRef}
    >
      {label && windowHeight > 600 ? (
        <h3 className="flex justify-center text-lg font-bold">{label}</h3>
      ) : null}
      <div className="form-control">
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
          {windowHeight > 750 ? (
            <>
              Theme colors
              <GithubPicker
                width="220px"
                colors={themeColorsArray}
                onChange={(color) => setColor(fieldName, color.hex)}
              />
            </>
          ) : null}
          <SliderPicker
            className="w-11/12"
            color={color}
            disableAlpha={true}
            onChange={(color) => setColor(fieldName, color.hex)}
          />
          <div className="relative flex gap-2 items-center justify-center">
            <input
              type="text"
              className="border border-gray-300 w-11/12 m-2focus:border-gray-800 p-3 rounded-md"
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
  setPickerIsOpen?: (isOpen: boolean) => void;
  onClick?: () => void;
}

export const InputColor: React.FC<InputColorProps> = ({
  fieldName,
  color,
  label = null,
  withLabel = true,
  setPickerIsOpen = null,
  onClick = null,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (setPickerIsOpen) setPickerIsOpen(true);
  };

  return (
    <div>
      {withLabel && label && <label className="block text-sm">{label}</label>}
      <div
        className={clsx(
          " bg-gray-500 cursor-pointer border-gray-300 rounded-md",
          { "w-8 h-6 m-1 border-4": withLabel },
          { "w-6 h-6 my-1 border-2": !withLabel }
        )}
        style={{ backgroundColor: color }}
        onClick={() => handleClick()}
        title={label}
      ></div>
    </div>
  );
};

interface TimerInputColorProps {
  timer: Timer;
  setColor: (fieldName: string, value: string) => void;
  onClose?: () => void | null;
  withLabel?: boolean;
  withTemplate?: boolean;
  closeOnOutsideClick?: boolean;
}

export const TimerInputColor: React.FC<TimerInputColorProps> = ({
  timer,
  setColor,
  onClose = null,
  withLabel = true,
  withTemplate = false,
  closeOnOutsideClick = false,
}) => {
  const pickerIsOpen = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handlePickerIsOpen = (isOpen: boolean) => {
    setShowColorPicker(isOpen);
    pickerIsOpen.current = isOpen;
  };

  useEffect(() => {
    if (!ref.current || closeOnOutsideClick == false || onClose === null)
      return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const colors = {
    pageColor: "Page",
    bgColor: "Back-gr.",
    timeColor: "Timer",
    textColor: "Text",
    pauseColor: "Pause",
  };

  const selectedColor = selectedField ? timer[selectedField] : null;
  const label = selectedField ? colors[selectedField] : null;

  return (
    <div
      ref={ref}
      className={clsx("flex flex-col justify-center items-center bg-base-100", {
        "p-2": withTemplate,
      })}
    >
      {withTemplate && (
        <>
          <DialogClose className="absolute top-1 right-4 p-2 z-20">
            <button className={hiddenBtnVariants({ size: "sm" })}>
              <X size={16} />
            </button>
          </DialogClose>
          <div
            className="card w-fit"
            style={{ backgroundColor: timer.pageColor, color: timer.textColor }}
          >
            <h2 className="text-center">{timer.title}</h2>
            <CountdownTimer
              diameter={200}
              endTime="template"
              {...timer}
              isPaused={true}
            />
          </div>
        </>
      )}
      <FieldLegend title="Timer color" onClose={withTemplate ? null : onClose}>
        {Object.entries(colors).map(([fieldName, label], idx) => (
          <InputColor
            key={idx}
            fieldName={fieldName}
            color={timer[fieldName]}
            label={label}
            withLabel={withLabel}
            onClick={() => {
              setSelectedField(fieldName);
              handlePickerIsOpen(true);
            }}
          />
        ))}
      </FieldLegend>
      {showColorPicker && selectedField !== null ? (
        <DisplayColorPicker
          setColor={setColor}
          color={selectedColor}
          fieldName={selectedField}
          label={label}
          closeColorPicker={() => handlePickerIsOpen(false)}
        />
      ) : null}
    </div>
  );
};
