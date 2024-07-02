"use client";
import { useEffect, useState } from "react";
import { TimerInput } from "./TimerInput";
// import { withMousePosition } from "../tools/withMousePosition";

// const TimerInputWP = withMousePosition(TimerInput);

import { TimerList } from "./TimerList";
export default function Home() {
  const [remainingTime, setRemainingTime] = useState(60); // Set your initial remaining time here
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Demander l'autorisation de notification lorsque le composant est monté pour la première fois
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:p-12">
      <TimerInput />
      {/* <TimerInputWP
        locked={true}
        titleBar={true}
        titleHidden={true}
        title="Timer"
      /> */}
      <TimerList />
    </main>
  );
}
