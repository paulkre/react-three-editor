import cn from "classnames";
import React from "react";

export const TextField: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    onValue: (value: string) => void;
  }
> = ({ onValue, value, className, ...props }) => {
  const [innerValue, setInnerValue] = React.useState(value);
  const [focussing, setFocussing] = React.useState(false);

  return (
    <input
      {...props}
      type="text"
      className={cn(
        "appearance-none bg-black border border-gray-600 px-4 py-2 w-24 text-gray-50 focus:outline-none focus:border-gray-600",
        className
      )}
      value={focussing ? innerValue : value}
      onInput={({ target }) =>
        setInnerValue((target as HTMLInputElement).value)
      }
      onFocus={() => {
        setInnerValue(value);
        setFocussing(true);
      }}
      onBlur={() => {
        onValue(innerValue?.toString() || "");
        setFocussing(false);
      }}
      onKeyDown={({ target, key }) => {
        if (key === "Enter") (target as HTMLInputElement).blur();
      }}
    />
  );
};
