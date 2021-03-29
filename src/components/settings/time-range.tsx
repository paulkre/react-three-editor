import React from "react";
import { useStore } from "../../state";

import { TextField } from "./text-field";
import { Heading } from ".";

export const TimeRangeSettings: React.FC = () => {
  const [
    {
      duration: { seconds: durationSeconds, frames },
      frameRate,
    },
    { setTimeRange },
  ] = useStore();

  return (
    <>
      <Heading>Time Range</Heading>
      <div className="mb-2">
        <TextField
          placeholder="Duration"
          value={durationSeconds}
          onValue={(value) => setTimeRange(parseFloat(value), frameRate)}
        />
        <span className="inline-block py-2 ml-2">Seconds</span>
      </div>
      <div className="mb-2">
        <TextField
          placeholder="FPS"
          value={frameRate}
          onValue={(value) => setTimeRange(durationSeconds, parseInt(value))}
        />
        <span className="inline-block py-2 ml-2">FPS</span>
      </div>
      <div className="text-xs">{frames} frames</div>
    </>
  );
};
