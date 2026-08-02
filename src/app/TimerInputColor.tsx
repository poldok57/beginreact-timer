import React, { useRef, useState, useEffect } from "react";
import { FieldLegend } from "./FieldLegend";
import { DialogClose } from "../components/atom/Dialog";
import { CountdownTimer } from "../components/timer/CountdownTimer";
import { myThemeColors } from "../../tailwind.config";
import { Timer } from "../types/timer";
import { X } from "lucide-react";
import clsx from "clsx";
import { hiddenBtnVariants } from "../style/form-variants";
import { DisplayColorPicker } from "../components/colors/DisplayColorPicker";

const themeColorsArray = ["#fff", "#000", ...Object.values(myThemeColors)];

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
  const [memoColor, setMemoColor] = useState<string | null>(null);

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
      className={clsx(
        "group/fieldset flex flex-col justify-center items-center bg-base-100",
        {
          "p-2": withTemplate,
        }
      )}
    >
      {withTemplate && (
        <>
          <DialogClose className="absolute top-1 right-4 p-2 z-20">
            <button
              className={hiddenBtnVariants({ size: "sm", group: "fieldset" })}
            >
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
              setMemoColor(timer[fieldName]);
              handlePickerIsOpen(true);
            }}
          />
        ))}
      </FieldLegend>
      {showColorPicker && selectedField !== null ? (
        <DisplayColorPicker
          setColor={setColor}
          color={selectedColor}
          themeColors={themeColorsArray}
          memoColor={memoColor}
          fieldName={selectedField}
          label={label}
          closeColorPicker={() => handlePickerIsOpen(false)}
        />
      ) : null}
    </div>
  );
};
