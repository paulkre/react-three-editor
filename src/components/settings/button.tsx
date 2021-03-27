import React from "react";
import cn from "classnames";

export enum ButtonVariant {
  Default,
  Cancel,
}

function getButtonTypeClassname(type: ButtonVariant) {
  switch (type) {
    case ButtonVariant.Cancel:
      return "text-red-600 border-red-600 hover:bg-red-600 hover:text-white";
    default:
      return "text-gray-700 border-gray-700 hover:bg-gray-300 hover:border-gray-300 hover:text-gray-900";
  }
}

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
> = ({ variant, ...props }) => (
  <button
    {...props}
    className={cn(
      "border-2 px-3 font-semibold uppercase py-2 transition",
      getButtonTypeClassname(variant || ButtonVariant.Default)
    )}
  />
);
