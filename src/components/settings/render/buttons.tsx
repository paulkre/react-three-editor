import React from "react";

import { AppMode, useStore } from "../../../state";
import { Button, ButtonVariant } from "../button";

export const RenderButtons: React.FC = () => {
  const [isRendering, startRendering, stopRendering] = useStore((state) => [
    state.mode === AppMode.Rendering,
    state.startRendering,
    state.stopRendering,
  ]);

  return isRendering ? (
    <Button onClick={stopRendering} variant={ButtonVariant.Cancel}>
      Stop
    </Button>
  ) : (
    <Button onClick={startRendering}>Start</Button>
  );
};
