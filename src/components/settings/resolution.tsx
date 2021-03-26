import React from "react";
import { useStore, State } from "../../state";

import { TextField } from "./text-field";
import { Heading } from ".";

export const ResolutionSettings: React.FC = () => {
  const [[width, height], setResolution] = useStore(
    React.useCallback(
      (state: State) => [state.resolution, state.setResolution],
      []
    )
  );

  return (
    <>
      <Heading>Resolution</Heading>
      <TextField
        placeholder="Width"
        value={width}
        onValue={(value) => setResolution([parseInt(value), height])}
      />
      <span className="px-2 text-gray-700 select-none">X</span>
      <TextField
        placeholder="Height"
        value={height}
        onValue={(value) => setResolution([width, parseInt(value)])}
      />
    </>
  );
};
