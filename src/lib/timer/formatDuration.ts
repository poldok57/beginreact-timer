export const formatDuration = (duration: number, withHours = false): string => {
  let seconds = Math.floor(Math.max(duration, 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  seconds %= 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  // format mm:ss
  if (hours === 0 && !withHours)
    return `${formattedMinutes}:${formattedSeconds}`;

  const formattedHours = hours.toString().padStart(2, "0");
  // format hh:mm:ss
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const formatTime = (duration: number, withHours = false): string => {
  let seconds = Math.floor(Math.max(duration, 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  seconds %= 60;

  const formattedHours = hours > 0 ? hours.toString() + " h " : "";
  const formattedMinutes = minutes > 0 ? minutes.toString() + " mn " : "";
  const formattedSeconds = seconds > 0 ? seconds.toString() + " sec" : "";

  // format hh:mm:ss
  return `${formattedHours}${formattedMinutes}${formattedSeconds}`.trim();
};
