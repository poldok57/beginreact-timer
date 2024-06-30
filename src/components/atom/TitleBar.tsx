import React, { forwardRef, ReactNode, Ref } from "react";
import clsx from "clsx";

interface TitleBarProps {
  className?: string;
  children?: ReactNode;
}

export const TitleBar = forwardRef<HTMLDivElement, TitleBarProps>(
  function TitleBar(
    { children, className, ...props },
    ref: Ref<HTMLDivElement>
  ) {
    return (
      <div
        ref={ref}
        className={clsx("flex items-center justify-center", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
