import { AppMode, StateCreator } from ".";

export enum RenderMode {
  Download,
  Server,
}

export type RenderingState = {
  renderMode: RenderMode;
  outDir: string;
  setOutDir(value: string): void;
  startRendering(): void;
  stopRendering(): void;
  renderNext(): void;
  setRenderMode(mode: RenderMode): void;
};

export const renderingStateCreator: StateCreator<RenderingState> = (set) => ({
  isRendering: false,
  renderMode: RenderMode.Download,
  outDir: "out/",
  setOutDir: (value) =>
    set((state) =>
      state.mode === AppMode.Rendering || !value
        ? state
        : {
            ...state,
            outDir: value,
          }
    ),
  startRendering() {
    set((state) =>
      state.mode !== AppMode.Paused
        ? state
        : {
            ...state,
            mode: AppMode.Rendering,
            frame: 0,
          }
    );
  },
  stopRendering() {
    set((state) =>
      state.mode !== AppMode.Rendering
        ? state
        : {
            ...state,
            mode: AppMode.Paused,
          }
    );
  },
  renderNext() {
    set((state) =>
      state.mode !== AppMode.Rendering
        ? state
        : state.frame < state.duration.frames - 1
        ? {
            ...state,
            frame: state.frame + 1,
          }
        : { ...state, mode: AppMode.Paused }
    );
  },
  setRenderMode: (renderMode) =>
    set((state) =>
      state.mode === AppMode.Rendering
        ? state
        : {
            ...state,
            renderMode,
          }
    ),
});
