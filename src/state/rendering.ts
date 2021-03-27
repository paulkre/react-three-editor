import { StateCreator } from ".";

export type RenderingState = {
  isRendering: boolean;
  startRendering(): void;
  renderNext(): void;
};

export const renderingStateCreator: StateCreator<RenderingState> = (set) => ({
  isRendering: false,
  startRendering() {
    set((state) =>
      state.isRendering
        ? state
        : {
            ...state,
            isPlaying: false,
            frame: 0,
            isRendering: true,
          }
    );
  },
  renderNext() {
    set((state) =>
      !state.isRendering || state.isPlaying
        ? state
        : state.frame < state.duration.frames - 1
        ? {
            ...state,
            frame: state.frame + 1,
          }
        : { ...state, isRendering: false }
    );
  },
});
