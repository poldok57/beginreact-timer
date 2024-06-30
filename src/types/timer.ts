/**
 * @typedef {Object} Timer
 * @property {string} id - The unique identifier for the timer. Generated using Date.now()
 * @property {number} duration - The duration of the timer in milliseconds.
 * @property {number} timeLeft - The remaining time of the timer in milliseconds.
 * @property {number} endAt - The end time of the timer in milliseconds.
 * @property {boolean} isPaused - Indicates if the timer is NOT currently running.
 * @property {string} title - The name of the timer.
 */
export type Timer = {
  id: string;
  duration: number;
  timeLeft: number;
  endAt: number;
  isPaused: boolean;
  isMinimized: boolean;
  title: string;
};
