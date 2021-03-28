import React from "react";
import cn from "classnames";
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
  const [shown, setShown] = React.useState(false);

  return (
    <div className="h-full pt-20 text-gray-400 select-none">
      <button
        className={cn(
          "appearance-none fixed top-6 right-6 px-8 py-4 bg-gray-100 rounded-full uppercase tracking-wider font-semibold transition duration-500 hover:bg-gray-200 hover:text-gray-500",
          shown && "bg-gray-200 text-gray-500"
        )}
        onClick={() => setShown(!shown)}
      >
        Settings
      </button>
      <div
        className={cn(
          "w-full h-full p-6 overflow-hidden transform transition-all duration-500",
          shown ? "max-w-7xl" : "max-w-0 translate-x-full pointer-events-none"
        )}
      >
        <div className="py-8 h-full bg-gray-100 rounded-3xl">
          <div className="px-8 h-full overflow-y-auto max-h-full">
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
      </div>
    </div>
  );
};
