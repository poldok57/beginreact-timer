"use client";
import { cva, type VariantProps } from "class-variance-authority";

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export const buttonVariants = cva(
  [
    "btn transition-colors px-3 py-1.5 shadow",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500",
  ],
  {
    variants: {
      variant: {
        warning: "btn-warning",
        primary: "btn-primary",
        success: "btn-success",
        default: "bg-gray-950 text-gray-100 hover:bg-gray-800",
        ghost:
          "bg-transparent text-gray-950 hover:bg-gray-200 active:bg-gray-300",
        secondary: "bg-gray-200 text-gray-950 hover:bg-gray-300",
      },
      size: {
        xs: "btn-xs",
        sm: "btn-sm",
        md: "",
        lg: "btn-lg",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export const hiddenBtnVariants = cva(
  [
    "btn btn-square hover:border-neutral",
    "transition-opacity duration-300  group-hover:opacity-100",
  ],
  {
    variants: {
      variant: {
        square: "btn-square",
        warning: "btn-warning",
        primary: "btn-primary",
        success: "btn-success",
      },
      opacity: {
        "0": "opacity-0",
        "10": "opacity-10",
        "20": "opacity-20",
        "30": "opacity-30",
        "50": "opacity-50",
        "60": "opacity-60",
        "80": "opacity-80",
      },
      size: {
        xs: "btn-xs",
        sm: "btn-sm",
        md: "",
        lg: "btn-lg",
      },
      border: {
        warning: "border border-warning",
        primary: "border border-primary",
        success: "border border-success",
        neutral: "border border-base-300",
        none: "",
      },
    },
    defaultVariants: {
      variant: "square",
      size: "md",
      opacity: "0",
      border: "neutral",
    },
  }
);

export const incrementBtnVariants = cva(
  [
    "text-neutral absolute rounded-full",
    "hidden opacity-40 group-hover:flex hover:opacity-90",
  ],
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      pos: {
        top: "top-1",
        bottom: "bottom-1",
      },
      side: {
        left: "left-1",
        right: "right-1",
      },
      color: {
        primary: "bg-primary",
        secondary: "bg-secondary",
        orange: "bg-orange-300",
        green: "bg-green-300",
        purple: "bg-purple-300",
        red: "bg-red-300",
        none: "",
      },
    },
    defaultVariants: {
      size: "md",
      pos: "bottom",
      side: "right",
      color: "none",
    },
  }
);

export const filesetVariants = cva(
  ["group input input-bordered my-2 rounded-md bg-base-200,"],
  {
    variants: {
      theme: {
        primary: "text-primary",
        secondary: "text-secondary",
        neutral: "text-neutral",
      },
      bg: {
        base100: "bg-base-100",
        base200: "bg-base-200",
        base300: "bg-base-300",
        accent: "bg-accent",
      },
      position: {
        relative: "relative",
        absolute: "absolute",
        none: "",
      },
      flex: {
        row: "flex flex-row justify-between gap-2 w-full",
        rowNoGap: "flex flex-row items-center justify-between w-full",
        col: "flex flex-col",
      },
      items: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        none: "",
      },
      h: {
        "28": "h-28",
        "32": "h-32",
        "36": "h-36",
        fit: "h-fit",
      },
    },
    defaultVariants: {
      theme: "primary",
      bg: "base200",
      items: "center",
      h: "fit",
      position: "relative",
    },
  }
);

export const lengendVariants = cva(
  [
    "text rounded-full border border-transparent group-hover:border-secondary py-1 px-3",
  ],
  {
    variants: {
      theme: {
        primary: "text-primary",
        secondary: "text-secondary",
        neutral: "text-neutral",
      },
      bg: {
        base100: "bg-base-100",
        base200: "bg-base-200",
        base300: "bg-base-300",
        accent: "bg-accent",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      },
    },
    defaultVariants: { theme: "primary", bg: "base100", size: "sm" },
  }
);
