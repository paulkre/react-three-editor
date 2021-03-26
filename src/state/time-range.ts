import { StateCreator } from ".";

export type TimeRangeState = {
  duration: {
    ms: number;
    seconds: number;
    frames: number;
  };
  frameRate: number;
  setTimeRange(durationSeconds: number, frameRate: number): void;
};

export const timeRangeStateCreator: StateCreator<TimeRangeState> = (set) => ({
  duration: {
    ms: 5000,
    seconds: 5,
    frames: 250,
  },
  frameRate: 50,
  setTimeRange: (durationSeconds, frameRate) => {
    if (isNaN(durationSeconds) || isNaN(frameRate)) return;

    frameRate = Math.max(1, Math.floor(frameRate));
    durationSeconds = Math.max(0.1, durationSeconds);

    const fracFrames = Math.ceil((durationSeconds % 1) * frameRate);
    const fracMs = Math.floor((1000 / frameRate) * fracFrames);
    const ms = 1000 * Math.floor(durationSeconds) + fracMs;

    const frameCount = frameRate * Math.floor(durationSeconds) + fracFrames;

    set((state) => ({
      ...state,
      frame: Math.min(state.frame, frameCount - 1),
      frameRate,
      duration: {
        ms,
        seconds: ms / 1000,
        frames: frameCount,
      },
    }));
  },
});
