import React, { useState } from "react";
import { Timer } from "../types/timer";
import { CountdownTimer } from "../components/timer/CountdownTimer";
import { Palette } from "lucide-react";
import { TimerInputColor } from "./TimerInputColor";
import { filesetVariants, lengendVariants } from "../style/form-variants";
import { myThemeColors } from "../../tailwind.config";
import clsx from "clsx";

type TimerColor = {
  title: string;
  pageColor: string;
  bgColor: string;
  timeColor: string;
  textColor: string;
  pauseColor: string;
};

const templates: TimerColor[] = [
  {
    title: "Theme",
    pageColor: "transparent",
    bgColor: myThemeColors["base-200"],
    timeColor: myThemeColors.primary,
    textColor: myThemeColors.secondary,
    pauseColor: myThemeColors["warning-content"],
  },
  {
    title: "Contrast",
    pageColor: "transparent",
    bgColor: myThemeColors["base-100"],
    textColor: myThemeColors.accent,
    timeColor: myThemeColors["accent-content"],
    pauseColor: myThemeColors["warning-content"],
  },
  {
    title: "White",
    pageColor: "#bbb",
    bgColor: "#fff",
    timeColor: "#111",
    textColor: myThemeColors.secondary,
    pauseColor: myThemeColors["warning-content"],
  },
  {
    title: "Purple",
    pageColor: "transparent",
    bgColor: "#4c2d86",
    timeColor: "#c1b3e6",
    textColor: "#9979d2",
    pauseColor: "#2d8638",
  },
  {
    title: "Red",
    pageColor: "transparent",
    bgColor: "#db3e00",
    timeColor: "#fff",
    textColor: "#e6bfb3",
    pauseColor: "#fef3bd",
  },
];

interface TimerTemplateProps {
  timer: Timer;
  setTimerData: (timer: Timer) => void;
  onClose?: () => void | null;
  withLabel?: boolean;
}

export const TimerTemplate: React.FC<TimerTemplateProps> = ({
  timer,
  setTimerData,
  onClose = null,
  withLabel = true,
}) => {
  const [showInputColor, setShowInputColor] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const setColor = (fieldName: string, value: string) => {
    setTimerData({ ...timer, [fieldName]: value });
  };

  return (
    <>
      <fieldset
        className={filesetVariants({
          bg: "base100",
          flex: "row",
          className: "relative p-2 overflow-visible h-36 items-center",
        })}
      >
        <legend className={lengendVariants({ size: "sm" })}>Template</legend>

        {templates.map((template, index) => (
          <div
            className={clsx(
              "cursor-pointer w-14 h-24 flex flex-col items-center p-1 gap-1 rounded-md",
              {
                "-translate-y-4 h-32 overflow-visible": hoveredIndex == index,
              }
            )}
            style={{ backgroundColor: template.pageColor }}
            key={index}
            onClick={() => setTimerData({ ...timer, ...template })}
            onMouseOver={() => setHoveredIndex(index)}
            onMouseOut={() => setHoveredIndex(null)}
          >
            <div className="text-xs" style={{ color: template.timeColor }}>
              {template.title}
            </div>
            <CountdownTimer
              diameter={hoveredIndex == index ? 92 : 40}
              endTime="template"
              {...template}
            />
          </div>
        ))}
        <div>
          <Palette
            size={24}
            onClick={() => {
              setShowInputColor(!showInputColor);
            }}
          />
        </div>
      </fieldset>

      {showInputColor && (
        <TimerInputColor
          timer={timer}
          setColor={setColor}
          withLabel={false}
          onClose={() => setShowInputColor(false)}
        />
      )}
    </>
  );
};
