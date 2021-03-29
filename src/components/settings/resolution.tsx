import React from "react";
import { useStore } from "../../state";

import { TextField } from "./text-field";
import { Heading } from ".";

export const ResolutionSettings: React.FC = () => {
  const [
    {
      resolution: [width, height],
    },
    { setResolution },
  ] = useStore();

  return (
    <>
      <Heading>Resolution</Heading>
      <TextField
        placeholder="Width"
        value={width}
        onValue={(value) => setResolution([parseInt(value), height])}
      />
      <span className="px-2 select-none">X</span>
      <TextField
        placeholder="Height"
        value={height}
        onValue={(value) => setResolution([width, parseInt(value)])}
      />
    </>
  );
};
