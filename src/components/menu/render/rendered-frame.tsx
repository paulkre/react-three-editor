import React from "react";
import { useStore } from "../../../state";

type RenderedFrame = { name: string; data: string };

export function useRenderedFrame(): () => RenderedFrame {
  const [
    {
      duration: { frames },
      canvas,
      frame,
    },
  ] = useStore();

  return React.useCallback(
    () => ({
      name: `${(frame + 1)
        .toString()
        .padStart(frames.toString().length + 1, "0")}.png`,
      data: canvas!
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, ""),
    }),
    [frames, canvas, frame]
  );
}
