import { AppMode, ActionsCreator } from ".";

export enum RenderMode {
  Download,
  Server,
}

export type RenderingState = {
  renderMode: RenderMode;
  outDir: string;
};

export type RenderingActions = {
  setOutDir(value: string): void;
  startRendering(): void;
  stopRendering(): void;
  renderNext(): void;
  setRenderMode(mode: RenderMode): void;
};

export const initialRenderingState: RenderingState = {
  renderMode: RenderMode.Download,
  outDir: "out/",
};

export const createRenderingActions: ActionsCreator<RenderingActions> = (
  set
) => ({
  setOutDir: (value) =>
    set((state) =>
      state.mode === AppMode.Rendering || !value
        ? state
        : {
            outDir: value,
          }
    ),
  startRendering() {
    set((state) =>
      state.mode !== AppMode.Paused
        ? state
        : {
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
            frame: state.frame + 1,
          }
        : { mode: AppMode.Paused }
    );
  },
  setRenderMode: (renderMode) =>
    set((state) =>
      state.mode === AppMode.Rendering
        ? state
        : {
            renderMode,
          }
    ),
});
