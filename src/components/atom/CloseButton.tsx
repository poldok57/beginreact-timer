import { X } from "lucide-react";

import clsx from "clsx";

export const CloseButton = ({
  onClick,
  className = null,
  size = null,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "z-40 rounded border border-black bg-red-600 text-lg text-white opacity-30 group-hover:opacity-95",
        {
          "text-2xl": size === "2xl",
          "text-xl": size === "xl",
          "text-lg": size === "lg",
          "text-md": size === "md",
          "text-sm": size === "sm",
        },
        className
      )}
      onClick={onClick}
    >
      <X />
    </button>
  );
};
