import create from "zustand";
import { persist } from "zustand/middleware";
import type { SetState } from "zustand";

import { playingStateCreator, PlayingState } from "./playing";
import { timeRangeStateCreator, TimeRangeState } from "./time-range";
import { renderingStateCreator, RenderingState } from "./rendering";

export enum AppMode {
  Paused,
  Playing,
  Rendering,
}

export type Resolution = [number, number];

export type Background = {
  active: boolean;
  color: string;
};

export type State = PlayingState &
  TimeRangeState &
  RenderingState & {
    mode: AppMode;

    resolution: Resolution;
    setResolution(value: Resolution): void;

    background: Background;
    setBackground(value: Background): void;

    frame: number;
    setFrame(frame: number): void;

    canvas: HTMLCanvasElement | null;
    setCanvas(canvas: HTMLCanvasElement): void;
  };

export type StateCreator<T> = (set: SetState<State>) => T;

const cleanNumber = (n: number) => (isNaN(n) ? 0 : n);

const parseDimension = (n: number) => Math.max(1, Math.floor(cleanNumber(n)));

export const useStore = create<State>(
  persist(
    (set) => {
      return {
        ...playingStateCreator(set),
        ...timeRangeStateCreator(set),
        ...renderingStateCreator(set),

        mode: AppMode.Paused,

        resolution: [512, 512],
        setResolution: ([width, height]) =>
          set((state) =>
            state.mode === AppMode.Rendering || isNaN(width) || isNaN(height)
              ? state
              : {
                  ...state,
                  resolution: [parseDimension(width), parseDimension(height)],
                }
          ),

        background: {
          active: true,
          color: "black",
        },
        setBackground: (background) =>
          set((state) =>
            state.mode === AppMode.Rendering
              ? state
              : {
                  ...state,
                  background,
                }
          ),

        frame: 0,
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

        canvas: null,
        setCanvas: (canvas) =>
          set((state) => ({
            ...state,
            canvas,
          })),
      };
    },
    {
      name: "REACT_THREE_FIBER_PLAYGROUND",
      blacklist: ["canvas", "mode"],
    }
  )
);
