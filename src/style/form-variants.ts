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
        md: "btn-md",
        lg: "btn-lg",
        xl: "btn-xl",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
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
        md: "text-md",
        lg: "text-lg",
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
  ["group input input-bordered my-2 h-fit rounded-md items-center bg-base-200"],
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
      flex: {
        row: "flex flex-row",
        col: "flex flex-col",
      },
    },
    defaultVariants: { theme: "primary", bg: "base200" },
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
