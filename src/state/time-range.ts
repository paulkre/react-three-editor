import { AppMode, ActionsCreator } from ".";

export type TimeRangeState = {
  duration: {
    ms: number;
    seconds: number;
    frames: number;
  };
  frameRate: number;
};

export type TimeRangeActions = {
  setTimeRange(durationSeconds: number, frameRate: number): void;
};

export const initialTimeRangeState: TimeRangeState = {
  duration: {
    ms: 5000,
    seconds: 5,
    frames: 250,
  },
  frameRate: 50,
};

export const createTimeRangeActions: ActionsCreator<TimeRangeActions> = (
  set
) => ({
  setTimeRange: (durationSeconds, frameRate) =>
    set((state) => {
      if (
        state.mode !== AppMode.Paused ||
        isNaN(durationSeconds) ||
        isNaN(frameRate)
      )
        return state;

      frameRate = Math.max(1, Math.floor(frameRate));
      durationSeconds = Math.max(0.1, durationSeconds);

      const fracFrames = Math.ceil((durationSeconds % 1) * frameRate);
      const fracMs = Math.floor((1000 / frameRate) * fracFrames);
      const ms = 1000 * Math.floor(durationSeconds) + fracMs;

      const frameCount = frameRate * Math.floor(durationSeconds) + fracFrames;

      return {
        frame: Math.min(state.frame, frameCount - 1),
        frameRate,
        duration: {
          ms,
          seconds: ms / 1000,
          frames: frameCount,
        },
      };
    }),
});
