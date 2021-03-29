import React from "react";
import { AppMode, useStore } from "../../state";

import { TimeSlider } from "./slider";

const PlayButton: React.FC = () => {
  const [{ mode }, { startPlaying, stopPlaying }] = useStore();

  const isPlaying = mode === AppMode.Playing;

  React.useEffect(() => {
    function handlePause({ key }: KeyboardEvent) {
      if (key === " ") (isPlaying ? stopPlaying : startPlaying)();
    }

    window.addEventListener("keydown", handlePause);
    return () => window.removeEventListener("keydown", handlePause);
  }, [isPlaying, startPlaying, stopPlaying]);

  return (
    <button
      className="appearance-none text-action transition w-12 h-12 p-3"
      onClick={isPlaying ? stopPlaying : startPlaying}
      onKeyUp={(evt) => evt.preventDefault()}
    >
      <svg
        className="pointer-events-none w-full h-full"
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isPlaying ? (
          <>
            <rect x="1" width="12" height="32" />
            <rect x="19" width="12" height="32" />
          </>
        ) : (
          <path d="M30 16L2 32L2 0L30 16Z" />
        )}
      </svg>
    </button>
  );
};

export const Timeline: React.FC = () => (
  <div className="h-12 flex box-content">
    <div>
      <PlayButton />
    </div>
    <div className="flex-1 pl-4 overflow-hidden">
      <TimeSlider />
    </div>
  </div>
);
