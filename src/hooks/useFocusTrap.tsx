// @ts-nocheck
"use client";
import { useEventListener } from "./useEventListener";

const getFocusableElements = (ref) =>
  Array.from(
    ref.current.querySelectorAll("a[href], button, textarea, input, select")
  );

export const useFocusTrap = (ref) => {
  const handleKey = (event) => {
    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements(ref);

    const activeElement = document.activeElement;

    let nextIndex = event.shiftKey
      ? focusableElements.indexOf(activeElement) - 1
      : focusableElements.indexOf(activeElement) + 1;

    const toFocusElement = focusableElements[nextIndex];

    if (toFocusElement) {
      // let's DOM handle the focus
      return;
    }
    // element outside the dialog let's loop on Dialog's focusable elements
    nextIndex = nextIndex < 0 ? focusableElements.length - 1 : 0;

    focusableElements[nextIndex].focus();
    event.preventDefault();
    return;
  };

  useEventListener({
    handler: handleKey,
    isEnabled: true,
    type: "keydown",
    element: typeof document !== "undefined" ? document : null,
  });
};
