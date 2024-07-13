import React, { useState } from "react";
import { Timer } from "../types/timer";
import { CountdownTimer } from "../components/timer/CountdownTimer";
import { X, Palette } from "lucide-react";
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
    title: "Light",
    pageColor: "#bbb",
    bgColor: "#fff",
    timeColor: "#111",
    textColor: "#333",
    pauseColor: "#f11",
  },
  {
    title: "Dark",
    pageColor: myThemeColors["base-200"],
    bgColor: myThemeColors["base-100"],
    textColor: myThemeColors.accent,
    timeColor: myThemeColors["accent-content"],
    pauseColor: myThemeColors["warning-content"],
  },
  {
    title: "Theme",
    pageColor: "transparent",
    bgColor: myThemeColors["base-200"],
    timeColor: myThemeColors.primary,
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
  setShowInputColor: (show: boolean) => void;
  setShowTemplate?: (show: boolean) => void;
  setTemplateName?: (name: string) => void;
  onClose?: () => void;
}

export const TimerTemplate: React.FC<TimerTemplateProps> = ({
  timer,
  setTimerData,
  setShowInputColor,
  setShowTemplate,
  setTemplateName,
  onClose = null,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const valideTemplate = (template: TimerColor) => {
    setTimerData({ ...timer, ...template });
    setTemplateName?.(template.title);
    setShowTemplate?.(false);
  };
  return (
    <>
      <fieldset
        className={filesetVariants({
          bg: "base100",
          flex: "row",
          items: "start",
          h: "28",
          className: "relative p-2 overflow-visible",
        })}
      >
        <legend className={lengendVariants({ size: "sm" })}>Template</legend>
        <div className="absolute flex -top-7 right-0 p-1 gap-1">
          <button
            className="btn btn-sm border border-warning"
            onClick={() => {
              setShowInputColor(true);
            }}
          >
            <Palette size={18} />
          </button>
          {onClose && (
            <button
              className="btn btn-sm border border-warning"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {templates.map((template, index) => (
          <div
            className={clsx([
              "cursor-pointer w-12 h-fit flex flex-col items-center p-1 gap-1 rounded-md",
              "hover:overflow-visible hover:-translate-y-4",
            ])}
            style={{ backgroundColor: template.pageColor }}
            key={index}
            onClick={() => valideTemplate(template)}
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
      </fieldset>
    </>
  );
};
