import React from "react";
import { useFrame as useThreeFrame } from "react-three-fiber";

type FrameContext = {
  time: number;
  delta: number;
  frame: number;
};

type FrameCallback = (ctx: FrameContext) => void;

export type FrameManager = {
  subscribe(
    ref: React.MutableRefObject<FrameCallback>,
    priority?: number
  ): () => void;
};

const Context = React.createContext<FrameManager>({
  subscribe: () => () => {},
});

export function useFrame(cb: FrameCallback, priority = 0) {
  const { subscribe } = React.useContext(Context);
  const ref = React.useRef(cb);
  React.useLayoutEffect(() => void (ref.current = cb), [cb]);
  React.useEffect(() => subscribe(ref, priority), [priority, subscribe]);
}

export const FrameProvider: React.FC<{
  frame: number;
  isPlaying: boolean;
  frameRate: number;
  durationMs: number;
  playStart: number;
}> = ({ children, frame, isPlaying, frameRate, durationMs, playStart }) => {
  const subscriberRef = React.useRef<
    { ref: React.MutableRefObject<FrameCallback>; priority: number }[]
  >([]);

  const manager = React.useMemo<FrameManager>(
    () => ({
      subscribe(ref, priority = 0) {
        subscriberRef.current.push({ ref, priority });
        subscriberRef.current = subscriberRef.current.sort(
          (a, b) => a.priority - b.priority
        );

        return () => {
          subscriberRef.current = subscriberRef.current.filter(
            (s) => s.ref !== ref
          );
        };
      },
    }),
    []
  );

  const lastTimeRef = React.useRef(-1);
  useThreeFrame(() => {
    const subs = subscriberRef.current;
    if (!subs.length) return;

    let time = Math.floor(frame * (1000 / frameRate));
    let currentFrame = frame;

    if (isPlaying) {
      time = (time + Date.now() - playStart) % durationMs;
      currentFrame = Math.floor((time % durationMs) / (1000 / frameRate));
    }

    if (time === lastTimeRef.current) return;

    if (lastTimeRef.current < 0) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    subs.forEach(({ ref }) =>
      ref.current({ time, delta, frame: currentFrame })
    );
  });

  return <Context.Provider value={manager}>{children}</Context.Provider>;
};
