import React from "react";
import cn from "classnames";
import { useStore, State } from "../../state";
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
          "appearance-none block w-8 h-8 rounded-lg border transition-all hover:border-gray-600",
          active ? "border-gray-400" : "border-gray-700"
        )}
        onClick={() => setActive(!active)}
        style={{ background: color }}
        disabled={disabled}
      />
      <div
        className={cn("transition", !active && "pointer-events-none opacity-0")}
      >
        <div onClick={() => setActive(false)} className="fixed inset-0" />
        <div className="absolute left-0 pt-2 text-black">
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
  const [{ active, color }, setBackground] = useStore(
    React.useCallback(
      (state: State) => [state.background, state.setBackground],
      []
    )
  );

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