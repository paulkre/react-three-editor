import { AppMode, ActionsCreator } from ".";

export type PlayingState = {
  isPlaying: boolean;
  playStart: number;
};

export type PlayingActions = {
  startPlaying(): void;
  stopPlaying(): void;
};

export const initialPlayingState: PlayingState = {
  isPlaying: false,
  playStart: 0,
};

export const createPlayingActions: ActionsCreator<PlayingActions> = (set) => ({
  startPlaying() {
    set((state) =>
      state.mode !== AppMode.Paused
        ? state
        : {
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
        mode: AppMode.Paused,
        frame: Math.floor((ms % totalMs) / (1000 / state.frameRate)),
      };
    });
  },
});
