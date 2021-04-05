import {
  createStateManager,
  ActionsCreator as ActionsCreatorBase,
} from "./state-manager";

import {
  initialPlayingState,
  createPlayingActions,
  PlayingState,
  PlayingActions,
} from "./playing";

import {
  initialTimeRangeState,
  createTimeRangeActions,
  TimeRangeState,
  TimeRangeActions,
} from "./time-range";

import {
  initialRenderingState,
  createRenderingActions,
  RenderingState,
  RenderingActions,
} from "./rendering";

export enum AppMode {
  Paused,
  Playing,
  Rendering,
}

export type Resolution = [number, number];

type State = PlayingState &
  TimeRangeState &
  RenderingState & {
    mode: AppMode;
    resolution: Resolution;
    background: string | null;
    frame: number;
    canvas: HTMLCanvasElement | null;
  };

type Actions = PlayingActions &
  TimeRangeActions &
  RenderingActions & {
    setResolution(value: Resolution): void;
    setBackground(value: string | null): void;
    setFrame(frame: number): void;
    setCanvas(canvas: HTMLCanvasElement): void;
  };

export type ActionsCreator<A> = ActionsCreatorBase<State, A>;

const cleanNumber = (n: number) => (isNaN(n) ? 0 : n);
const parseDimension = (n: number) => Math.max(1, Math.floor(cleanNumber(n)));

export const defaultState: State = {
  ...initialPlayingState,
  ...initialTimeRangeState,
  ...initialRenderingState,
  mode: AppMode.Paused,
  resolution: [256, 256],
  background: "black",
  frame: 0,
  canvas: null,
};

export const { StoreProvider, useStore } = createStateManager<State, Actions>(
  defaultState,
  (set) => ({
    ...createPlayingActions(set),
    ...createTimeRangeActions(set),
    ...createRenderingActions(set),
    setResolution: ([width, height]) =>
      set((state) =>
        state.mode === AppMode.Rendering || isNaN(width) || isNaN(height)
          ? state
          : {
              resolution: [parseDimension(width), parseDimension(height)],
            }
      ),
    setBackground: (background) =>
      set((state) =>
        state.mode === AppMode.Rendering ? state : { background }
      ),
    setFrame(frame) {
      set((state) => ({
        ...state,
        frame: isNaN(frame)
          ? 0
          : Math.max(0, Math.min(state.duration.frames - 1, Math.floor(frame))),
      }));
    },
    setCanvas: (canvas) =>
      set(() => ({
        canvas,
      })),
  }),
  {
    persist: {
      name: "REACT_THREE_FIBER_PLAYGROUND",
      include: ["frame"],
    },
  }
);
