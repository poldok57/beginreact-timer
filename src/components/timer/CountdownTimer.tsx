import React from "react";
import { formatDuration } from "../../lib/timer/formatDuration";

interface CountdownTimerProps {
  baseColor: string;
  remainingColor: string;
  diameter: number;
  totalDuration: number;
  endTime: string;
  remainingTime: number;
  isPaused: boolean;
  strokeWidth?: number;
  textColor?: string;
  pauseColor?: string;
  timeColor?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  baseColor,
  remainingColor,
  diameter,
  totalDuration,
  endTime,
  remainingTime,
  isPaused,
  strokeWidth = 10,
  textColor = "#eee",
  pauseColor = "#f22",
  timeColor = "#fa4",
}) => {
  const radius = diameter / 2;
  const fontSizeBig = radius * 0.6;
  const fontSize1 = radius * 0.15;
  const fontSize2 = radius * 0.12;
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

  return (
    <svg height={diameter} width={diameter}>
      <circle
        stroke={baseColor}
        fill="transparent"
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
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={strokeDashoffset}
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
      <text
        x="50%"
        y="30%"
        textAnchor="middle"
        fontSize={fontSize1}
        fill={textColor}
      >
        {remainingTime > 0 ? "End : " : "Ended : "}
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
