"use client";
import { ChangeEvent } from "react";
import { CircleMinus } from "lucide-react";
import { CirclePlus } from "lucide-react";
import { incrementBtnVariants } from "../style/form-variants";

export const TwoDigitInput: React.FunctionComponent<any> = ({
  fieldName,
  value,
  onChange,
  cut = 2,
  children = null,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Supprimez tout ce qui n'est pas un chiffre
    val = val.replace(/\D/g, "");

    if (cut > 0 && val.length > cut) {
      val = val.slice(val.length - cut, val.length);
      // Ajoutez un zéro devant si nécessaire pour avoir toujours deux chiffres
      val = val.padStart(cut, "0");
    }
    e.target.value = val;
    // setValue(val);
    onChange(e);
  };
  const changeValue = (delta: number) => {
    // Call your increment function here
    const newValue = Number(value) + delta;
    if (newValue < 0 || isNaN(newValue)) {
      return;
    }
    const eventAlias = {
      target: {
        name: fieldName,
        value: newValue.toString(),
      },
    };
    onChange(eventAlias as ChangeEvent<HTMLInputElement>);
  };

  return (
    <label
      htmlFor={fieldName}
      className="group/digit h-fit flex relative flex-row items-center text-xl text-neutral text-semibold"
    >
      <input
        type="text"
        name={fieldName}
        id={fieldName}
        value={value}
        onChange={handleChange}
        className="w-24 p-2 text-6xl justify-center text-neutral font-semibold rounded-md group-hover/digit:bg-accent"
        placeholder="00"
        inputMode="numeric"
      />
      {children}
      <CircleMinus
        size={20}
        className={incrementBtnVariants({
          pos: "bottom",
          color: "secondary",
          className: "text-base-100",
        })}
        onClick={() => changeValue(-1)}
      />
      <CirclePlus
        size={20}
        className={incrementBtnVariants({
          pos: "top",
          color: "secondary",
          className: "text-base-100",
        })}
        onClick={() => changeValue(1)}
      />
    </label>
  );
};
