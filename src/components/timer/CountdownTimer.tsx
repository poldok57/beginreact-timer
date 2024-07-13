import React from "react";
import { formatDuration } from "../../lib/timer/formatDuration";
import { AlarmClockCheck, Pause } from "lucide-react";

interface CountdownTimerProps {
  baseColor?: string;
  remainingColor?: string;
  bgColor?: string;
  diameter: number;
  endTime: string;
  totalDuration?: number;
  remainingTime?: number;
  isPaused?: boolean;
  textColor?: string;
  pauseColor?: string;
  timeColor?: string;
  style?: React.CSSProperties | null;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  baseColor = "#ddd",
  remainingColor = "#f00",
  diameter,
  totalDuration = 15 * 60,
  remainingTime = 15 * 60,
  endTime,
  isPaused = false,
  bgColor = "transparent",
  textColor = "#eee",
  pauseColor = "#f22",
  timeColor = "#fa4",
  style = null,
}) => {
  const radius = diameter / 2;
  const fontSizeBig = remainingTime > 3600 ? radius * 0.48 : radius * 0.6;
  const fontSize1 = radius * 0.15;
  const fontSize2 = radius * 0.12;
  const strokeWidth = Math.max(2, diameter / 50);

  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (remainingTime / totalDuration) * circumference;

  // troteuse
  const rest = Math.floor(remainingTime) % 60;

  const endAngle = (-rest / 30) * Math.PI - Math.PI / 2;
  const endX = radius + normalizedRadius * Math.cos(endAngle);
  const endY = radius + normalizedRadius * Math.sin(endAngle);
  const startX = radius + ((radius * 3) / 4) * Math.cos(endAngle);
  const startY = radius + ((radius * 3) / 4) * Math.sin(endAngle);

  const textPos = {
    x: `${0.6 * radius}px`,
    x2: `${0.8 * radius}px`,

    y: `${0.47 * radius}px`,
    y2: `${0.6 * radius}px`,
  };

  return (
    <svg height={diameter} width={diameter} style={style}>
      <circle
        stroke={baseColor}
        fill={bgColor}
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={remainingColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeLinecap="round"
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${radius} ${radius})`} // Rotate to start at the top
        style={{ transition: "stroke-dashoffset 0.35s" }}
      />
      <line
        x1={radius}
        y1={radius - normalizedRadius}
        x2={radius}
        y2={radius - normalizedRadius - strokeWidth / 2}
        stroke="#f88"
        strokeWidth="5"
      />
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#888"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize={fontSizeBig}
        fill={timeColor}
        fontFamily="System-ui, Monospace, Arial"
      >
        {/* {remainingTime.toFixed(0)} */}
        {formatDuration(remainingTime)}
      </text>
      {remainingTime > 0 && isPaused ? (
        <Pause
          size={fontSize1}
          x={textPos.x}
          y={textPos.y}
          stroke={pauseColor}
        />
      ) : (
        <AlarmClockCheck
          size={fontSize1}
          x={textPos.x}
          y={textPos.y}
          stroke={remainingTime > 0 ? textColor : "red"}
        />
      )}
      ;
      <text x={textPos.x2} y={textPos.y2} fontSize={fontSize1} fill={textColor}>
        {endTime}
      </text>
      {remainingTime <= 0 && (
        <text
          x="50%"
          y="70%"
          textAnchor="middle"
          fontSize={fontSize2}
          fill={pauseColor}
        >
          timer ({formatDuration(totalDuration)}) elapsed
        </text>
      )}
      {remainingTime > 0 && isPaused && (
        <text
          x="50%"
          y="70%"
          textAnchor="middle"
          fontSize={fontSize1}
          fill={pauseColor}
        >
          Pause
        </text>
      )}
      {remainingTime > 0 && !isPaused && (
        <text
          x="50%"
          y="70%"
          textAnchor="middle"
          fontSize={fontSize2}
          fill={pauseColor}
        >
          Total: {formatDuration(totalDuration)}
        </text>
      )}
    </svg>
  );
};

export default CountdownTimer;
