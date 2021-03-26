import React from "react";
import { BackgroundSettings } from "./background";
import { ResolutionSettings } from "./resolution";
import { TimeRangeSettings } from "./time-range";
import { RenderSettings } from "./render";

export const Heading: React.FC = ({ children }) => (
  <div className="uppercase tracking-wide mb-3 select-none text-lg">
    {children}
  </div>
);

export const Settings: React.FC = () => {
  return (
    <div className="h-full bg-black bg-opacity-10 text-gray-600 overflow-hidden select-none">
      <div className="p-8 h-full overflow-y-auto max-h-full">
        <div className="mb-8">
          <ResolutionSettings />
        </div>
        <div className="mb-8">
          <BackgroundSettings />
        </div>
        <div className="mb-8">
          <TimeRangeSettings />
        </div>
        <RenderSettings />
      </div>
    </div>
  );
};
