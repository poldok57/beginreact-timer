"use client";
import { useEffect, useRef, RefObject } from "react";

interface UseEventListenerOptions<E extends HTMLElement = HTMLElement> {
  handler: (event: Event) => void;
  isEnabled?: boolean;
  type: string;
  element?: E | Window;
}

export const useEventListener = <E extends HTMLElement = HTMLElement>({
  handler,
  isEnabled = true,
  type,
  element = window,
}: UseEventListenerOptions<E>) => {
  const handlerRef = useRef<(event: Event) => void>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    if (!element) {
      return;
    }

    const onEvent = (e: Event) => {
      handlerRef.current(e);
    };

    element.addEventListener(type, onEvent);

    return () => {
      element.removeEventListener(type, onEvent);
    };
  }, [isEnabled, type, element]);
};
