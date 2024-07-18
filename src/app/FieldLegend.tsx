import React from "react";
import { filesetVariants, lengendVariants } from "../style/form-variants";
import { hiddenBtnVariants } from "../style/form-variants";
import { X } from "lucide-react";
import clsx from "clsx";

type FieldLegendProps = {
  onClose: () => void;
  title: string;
  height?: "fit" | "28" | "32" | "36";
  items?: "start" | "center" | "end";
  addButton?: React.ReactNode;
  children: React.ReactNode;
};

export const FieldLegend: React.FC<FieldLegendProps> = ({
  onClose,
  title,
  height = "fit",
  items = "center",
  addButton = null,
  children,
}) => {
  return (
    <fieldset
      className={filesetVariants({
        bg: "base200",
        flex: "row",
        items: items,
        h: height,
      })}
    >
      <legend className={lengendVariants({ size: "sm" })}>{title}</legend>
      {onClose && (
        <div className="absolute flex -top-7 right-0 gap-1">
          {addButton}
          <button
            className={hiddenBtnVariants({
              size: "sm",
              border: "warning",
              opacity: "60",
            })}
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {children}
    </fieldset>
  );
};
