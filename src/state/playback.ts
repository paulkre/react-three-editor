import { StateCreator } from ".";

export type PlaybackState = {
  isPlaying: boolean;
  playStart: number;
  startPlaying(): void;
  stopPlaying(): void;
};

export const playbackStateCreator: StateCreator<PlaybackState> = (set) => ({
  isPlaying: false,
  playStart: 0,
  startPlaying() {
    set((state) =>
      state.isPlaying
        ? state
        : {
            ...state,
            isPlaying: true,
            playStart: Date.now(),
          }
    );
  },
  stopPlaying: () => {
    set((state) => {
      if (!state.isPlaying) return state;

      const frameMs = Math.floor(state.frame * (1000 / state.frameRate));
      const totalMs = Math.floor(state.duration.ms);
      const ms = frameMs + Date.now() - state.playStart;

      return {
        ...state,
        isPlaying: false,
        frame: Math.floor((ms % totalMs) / (1000 / state.frameRate)),
      };
    });
  },
});
