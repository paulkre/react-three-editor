import { AppMode, StateCreator } from ".";

export type PlayingState = {
  playStart: number;
  startPlaying(): void;
  stopPlaying(): void;
};

export const playingStateCreator: StateCreator<PlayingState> = (set) => ({
  isPlaying: false,
  playStart: 0,
  startPlaying() {
    set((state) =>
      state.mode !== AppMode.Paused
        ? state
        : {
            ...state,
            mode: AppMode.Playing,
            playStart: Date.now(),
          }
    );
  },
  stopPlaying: () => {
    set((state) => {
      if (state.mode !== AppMode.Playing) return state;

      const frameMs = Math.floor(state.frame * (1000 / state.frameRate));
      const totalMs = Math.floor(state.duration.ms);
      const ms = frameMs + Date.now() - state.playStart;

      return {
        ...state,
        mode: AppMode.Paused,
        frame: Math.floor((ms % totalMs) / (1000 / state.frameRate)),
      };
    });
  },
});
