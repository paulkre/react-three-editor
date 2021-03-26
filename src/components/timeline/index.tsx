import React from "react";
import { useStore } from "../../state";

import { TimeSlider } from "./slider";

const PlayButton: React.FC = () => {
  const [isPlaying, startPlaying, stopPlaying] = useStore((state) => [
    state.isPlaying,
    state.startPlaying,
    state.stopPlaying,
  ]);

  React.useEffect(() => {
    function handlePause({ key }: KeyboardEvent) {
      if (key === " ") (isPlaying ? stopPlaying : startPlaying)();
    }

    window.addEventListener("keydown", handlePause);
    return () => window.removeEventListener("keydown", handlePause);
  }, [isPlaying, startPlaying, stopPlaying]);

  return (
    <button
      className="appearance-none text-gray-400 transition w-10 h-10 p-2 hover:text-gray-300"
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
  <div className="h-10 bg-black bg-opacity-25 flex border-t-2 border-black box-content">
    <div>
      <PlayButton />
    </div>
    <div className="flex-1 bg-black bg-opacity-25 pl-4">
      <TimeSlider />
    </div>
  </div>
);
