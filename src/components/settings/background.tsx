import React from "react";
import cn from "classnames";
import { useStore } from "../../state";
import { SketchPicker } from "react-color";

import { Heading } from ".";

const ColorPicker: React.FC<{
  color: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ color, onChange, disabled }) => {
  const [active, setActive] = React.useState(false);

  return (
    <>
      <button
        className={cn(
          "appearance-none block w-8 h-8 rounded-lg border-2 transition-all hover:border-gray-500",
          active ? "border-gray-500" : "border-gray-400"
        )}
        onClick={() => setActive(!active)}
        style={{ background: color }}
        disabled={disabled}
      />
      <div className={active ? undefined : "pointer-events-none"}>
        <div onClick={() => setActive(false)} className="fixed inset-0" />
        <div
          className={cn(
            "absolute left-0 pt-2 text-black transition",
            !active && "opacity-0"
          )}
        >
          <SketchPicker
            disableAlpha={true}
            color={color}
            onChange={({ hex }) => onChange(hex)}
          />
        </div>
      </div>
    </>
  );
};

export const BackgroundSettings: React.FC = () => {
  const [
    {
      background: { active, color },
    },
    { setBackground },
  ] = useStore();

  return (
    <>
      <Heading>Background</Heading>
      <div className="flex items-center relative">
        <div className="pl-0.5 mr-4">
          <input
            type="checkbox"
            id="transparent-bg-cb"
            checked={active}
            onChange={({ target }) =>
              setBackground({ color, active: target.checked })
            }
            className="cursor-pointer w-4 h-4 mt-1.5"
          />
        </div>
        <div
          className={cn(
            "transition",
            !active && "pointer-events-none opacity-0"
          )}
        >
          <ColorPicker
            color={color}
            onChange={(color) => setBackground({ active, color })}
          />
        </div>
      </div>
    </>
  );
};
