"use client";
import { useEffect } from "react";
import { useTimersStore, useAndStartTimers } from "../hooks/zustand/timers";
import { TimerInput } from "./TimerInput";
import { TimerList } from "./TimerList";

// import { withMousePosition } from "../tools/withMousePosition";
// const TimerInputWP = withMousePosition(TimerInput);

export default function Home() {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    // Demander l'autorisation de notification lorsque le composant est monté pour la première fois
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  useAndStartTimers();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-12">
      <TimerInput />
      {/* <TimerInputWP
        locked={false}
        titleBar={true}
        titleHidden={false}
        close={false}
        title="My unbelivable timer !!!"
      /> */}
      <TimerList />
    </main>
  );
}
