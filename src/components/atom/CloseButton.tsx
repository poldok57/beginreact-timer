import { X } from "lucide-react";
import clsx from "clsx";
import React, { MouseEventHandler } from "react";

interface CloseButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: "2xl" | "xl" | "md" | "sm" | "xs";
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className,
  size = "md",
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "z-40 rounded border border-black bg-red-600 text-lg text-white opacity-30",
        {
          "text-2xl": size === "2xl",
          "text-xl": size === "xl",
          "text-md": size === "md",
          "text-sm": size === "sm",
          "text-xs": size === "xs",
        },
        className
      )}
      onClick={onClick}
    >
      <X />
    </button>
  );
};
