import React from "react";
import { Canvas, ContainerProps, useThree } from "react-three-fiber";
import { Color } from "three";

import { useStore, Background } from "../state";
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

export const Editor: React.FC<ContainerProps> = ({
  children,
  ...canvasProps
}) => {
  const [
    resolution,
    background,
    setCanvas,
    frame,
    isPlaying,
    frameRate,
    durationMs,
    playStart,
  ] = useStore((state) => [
    state.resolution,
    state.background,
    state.setCanvas,
    state.frame,
    state.isPlaying,
    state.frameRate,
    state.duration.ms,
    state.playStart,
  ]);

  return (
    <div className="flex flex-col h-screen max-w-full">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden flex justify-center items-center p-8 flex-shrink-1">
          <div className="overflow-auto shadow-viewer box-content border border-gray-700 max-w-full max-h-full bg-alpha0">
            <Canvas
              {...canvasProps}
              style={{
                width: `${resolution[0]}px`,
                height: `${resolution[1]}px`,
              }}
              gl={{
                ...canvasProps.gl,
                preserveDrawingBuffer: true,
              }}
            >
              <FrameProvider
                frame={frame}
                isPlaying={isPlaying}
                frameRate={frameRate}
                durationMs={durationMs}
                playStart={playStart}
              >
                <Scene background={background} setCanvas={setCanvas}>
                  {children}
                </Scene>
              </FrameProvider>
            </Canvas>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Settings />
        </div>
      </div>
      <div className="flex-shrink-0">
        <Timeline />
      </div>
    </div>
  );
};
