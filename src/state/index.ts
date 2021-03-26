import create from "zustand";
import { persist } from "zustand/middleware";
import type { SetState } from "zustand";

import { playbackStateCreator, PlaybackState } from "./playback";
import { timeRangeStateCreator, TimeRangeState } from "./time-range";

export type Resolution = [number, number];

export type Background = {
  active: boolean;
  color: string;
};

export type State = PlaybackState &
  TimeRangeState & {
    resolution: Resolution;
    background: Background;
    frame: number;
    setFrame(frame: number): void;
    setResolution(value: Resolution): void;
    setBackground(value: Background): void;
  };

export type StateCreator<T> = (set: SetState<State>) => T;

const cleanNumber = (n: number) => (isNaN(n) ? 0 : n);

const parseDimension = (n: number) => Math.max(1, Math.floor(cleanNumber(n)));

export const useStore = create<State>(
  persist(
    (set) => {
      return {
        ...playbackStateCreator(set),
        ...timeRangeStateCreator(set),
        resolution: [512, 512],
        background: {
          active: true,
          color: "black",
        },
        timeRange: {
          duration: 5,
          frameRate: 50,
          frameCount: 250,
        },
        frame: 0,
        setResolution: ([width, height]) => {
          if (isNaN(width) || isNaN(height)) return;
          set((state) => ({
            ...state,
            resolution: [parseDimension(width), parseDimension(height)],
          }));
        },
        setBackground: (background) =>
          set((state) => ({
            ...state,
            background,
          })),
        setFrame(frame) {
          set((state) => ({
            ...state,
            frame: isNaN(frame)
              ? 0
              : Math.max(
                  0,
                  Math.min(state.duration.frames - 1, Math.floor(frame))
                ),
          }));
        },
      };
    },
    { name: "REACT_THREE_FIBER_PLAYGROUND", blacklist: ["isPlaying"] }
  )
);
