import React from "react";

import { AppMode, useStore } from "../../../state";
import { Button, ButtonVariant } from "../button";

export const RenderButtons: React.FC = () => {
  const [{ mode }, { startRendering, stopRendering }] = useStore();

  return mode === AppMode.Rendering ? (
    <Button onClick={stopRendering} variant={ButtonVariant.Cancel}>
      Stop
    </Button>
  ) : (
    <Button onClick={startRendering}>Start</Button>
  );
};
