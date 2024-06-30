"use client";
import { Timer } from "../types/timer";
import { useTimersStore } from "../hooks/zustand/timers";
import { TimerInput } from "./TimerInput";
import { TimerList } from "./TimerList";
export default function Home() {
  const { timers, addTimer, getTimer } = useTimersStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:p-12">
      <TimerInput />
      <TimerList />
    </main>
  );
}
