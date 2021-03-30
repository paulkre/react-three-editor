import React from "react";
import {
  Canvas as ThreeCanvas,
  ContainerProps,
  useThree,
} from "react-three-fiber";
import { Color } from "three";

import { StoreProvider, useStore, Background, AppMode } from "../state";
import { Settings } from "./settings";
import { Timeline } from "./timeline";
import { FrameProvider } from "./frame-provider";

const Scene: React.FC<{
  background: Background;
  setCanvas(canvas: HTMLCanvasElement): void;
}> = ({ children, background, setCanvas }) => {
  const {
    scene,
    gl: { domElement },
  } = useThree();

  React.useEffect(() => {
    scene.background = background.active ? new Color(background.color) : null;
  }, [scene, background]);

  React.useEffect(() => {
    setCanvas(domElement);
  }, [domElement, setCanvas]);

  return <>{children}</>;
};

const Canvas: React.FC<ContainerProps> = ({ children, ...props }) => {
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
    { setCanvas },
  ] = useStore();

  return (
    <ThreeCanvas
      {...props}
      style={{
        width: `${resolution[0]}px`,
        height: `${resolution[1]}px`,
      }}
      gl={{
        ...props.gl,
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

export const Editor: React.FC<
  ContainerProps & {
    autoPlay?: boolean;
    resolution?: [number, number];
    hideUI?: boolean;
  }
> = ({ autoPlay, resolution, hideUI, ...canvasProps }) => {
  const userState = React.useMemo(
    () => ({
      ...(autoPlay && {
        mode: AppMode.Playing,
        playStart: Date.now(),
        frame: 0,
      }),
      ...(resolution && { resolution }),
    }),
    [autoPlay, resolution]
  );

  return (
    <StoreProvider userState={userState}>
      <div className="flex flex-col h-screen max-w-full bg-gray-50">
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden flex justify-center items-center p-6 flex-shrink-1">
            <div className="overflow-auto shadow-lg box-content max-w-full max-h-full bg-alpha0 bg-center">
              <Canvas {...canvasProps} />
            </div>
          </div>
          {!hideUI && (
            <div className="flex-shrink-0">
              <Settings />
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
};
