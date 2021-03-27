import React from "react";
import { useStore } from "../../../state";

type RenderedFrame = { name: string; data: string };

export function useRenderedFrame(): () => RenderedFrame {
  const [frameCount, canvas, frame] = useStore((state) => [
    state.duration.frames,
    state.canvas,
    state.frame,
  ]);

  return React.useCallback(
    () => ({
      name: `${(frame + 1)
        .toString()
        .padStart(frameCount.toString().length + 1, "0")}.png`,
      data: canvas!
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, ""),
    }),
    [frameCount, canvas, frame]
  );
}
