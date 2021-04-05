import React from "react";
import {
  Canvas as ThreeCanvas,
  ContainerProps,
  useThree,
} from "react-three-fiber";
import { Color } from "three";

import { StoreProvider, useStore, AppMode, Resolution } from "../state";
import { Menu } from "./menu";
import { Timeline } from "./timeline";
import { FrameProvider } from "./frame-provider";

const Scene: React.FC<{
  background: string | null;
  setCanvas(canvas: HTMLCanvasElement): void;
}> = ({ children, background, setCanvas }) => {
  const {
    scene,
    gl: { domElement },
  } = useThree();

  React.useEffect(() => {
    scene.background = background ? new Color(background) : null;
  }, [scene, background]);

  React.useEffect(() => {
    setCanvas(domElement);
  }, [domElement, setCanvas]);

  return <>{children}</>;
};

type InnerEditorProps = {
  resolution?: Resolution;
  background?: string | null;
  durationSeconds?: number;
  frameRate?: number;
  autoPlay?: boolean;
  canvas?: Omit<ContainerProps, "children">;
};

const Canvas: React.FC<InnerEditorProps> = ({
  children,
  resolution: resolutionProp,
  background: backgroundProp,
  durationSeconds: durationProp,
  frameRate: frameRateProp,
  autoPlay,
  canvas,
}) => {
  const [
    {
      mode,
      resolution,
      background,
      frame,
      frameRate,
      duration: { ms: durationMs },
      playStart,
    },
    {
      setCanvas,
      setResolution,
      setBackground,
      setTimeRange,
      setFrame,
      startPlaying,
    },
  ] = useStore();

  React.useEffect(() => {
    if (resolutionProp) setResolution(resolutionProp);
  }, [resolutionProp, setResolution]);

  React.useEffect(() => {
    if (backgroundProp !== undefined) setBackground(backgroundProp);
  }, [backgroundProp, setBackground]);

  React.useEffect(() => {
    if (durationProp && frameRateProp)
      setTimeRange(durationProp, frameRateProp);
  }, [durationProp, frameRateProp, setTimeRange]);

  React.useEffect(() => {
    if (!autoPlay) return;
    setFrame(0);
    startPlaying();
  }, [autoPlay, setFrame, startPlaying]);

  return (
    <ThreeCanvas
      {...canvas}
      style={{
        width: `${resolution[0]}px`,
        height: `${resolution[1]}px`,
      }}
      gl={{
        ...canvas?.gl,
        preserveDrawingBuffer: true,
      }}
    >
      <FrameProvider
        frame={frame}
        isPlaying={mode === AppMode.Playing}
        frameRate={frameRate}
        durationMs={durationMs}
        playStart={playStart}
      >
        <Scene background={background} setCanvas={setCanvas}>
          {children}
        </Scene>
      </FrameProvider>
    </ThreeCanvas>
  );
};

export const Editor: React.FC<InnerEditorProps & { hideUI?: boolean }> = ({
  hideUI,
  ...innerProps
}) => (
  <StoreProvider>
    <div className="flex flex-col h-screen max-w-full bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden flex justify-center items-center p-6 flex-shrink-1">
          <div className="overflow-auto shadow-lg box-content max-w-full max-h-full bg-alpha0 bg-center">
            <Canvas {...innerProps} />
          </div>
        </div>
        {!hideUI && (
          <div className="flex-shrink-0">
            <Menu />
          </div>
        )}
      </div>
      {!hideUI && (
        <div className="flex-shrink-0">
          <Timeline />
        </div>
      )}
    </div>
  </StoreProvider>
);
