import React from "react";
import { AppMode, useStore } from "../../state";

const Background: React.FC = () => {
  const [
    {
      duration: { frames: frameCount },
      frameRate,
    },
  ] = useStore();
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current!;

    function updateSize() {
      const style = getComputedStyle(canvas.parentElement!);
      canvas.width = parseFloat(style.width);
      canvas.height = parseFloat(style.height);
    }

    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let agg = 0;
      let d = 0;
      let fc = frameCount;
      let fr = frameRate;
      while (d < 4) {
        agg++;
        fc /= agg;
        fr /= agg;
        d = (canvas.width - 4) / fc;
      }

      const hh = canvas.height / 2;

      function line(x: number, l: number) {
        ctx.moveTo(x, hh - l);
        ctx.lineTo(x, hh + l);
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#4B5563";
      ctx.beginPath();
      for (let i = 0; i < fc; i++) {
        const x = 2 + i * d;
        line(x, i % 2 === 0 ? 4 : 2);
      }
      ctx.stroke();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1EA7FD";
      ctx.beginPath();
      for (let i = 0; i < fc; i += fr) {
        const x = 2 + i * d;
        line(x, 12);
      }
      ctx.stroke();
    }

    draw();

    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [frameCount, frameRate]);

  return (
    <canvas
      className="absolute inset-0 pointer-events-none w-full h-full"
      ref={ref}
    />
  );
};

const Pointer: React.FC = () => {
  const [
    {
      mode,
      duration: { frames: frameCount, ms: durationMs },
      frame,
      playStart,
      frameRate,
    },
    { setFrame, stopPlaying },
  ] = useStore();

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [domRect, setDOMRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    const button = buttonRef.current!;

    function updateRect() {
      setDOMRect(button.getBoundingClientRect());
    }

    updateRect();

    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  React.useEffect(() => {
    if (!domRect) return;

    const { left, width } = domRect;
    const button = buttonRef.current!;

    function updateFrame(clientX: number) {
      const x = Math.max(0, clientX - left) / width;
      setFrame(Math.floor(x * frameCount));
    }

    let mouseDown = false;
    function handleMouseDown({ clientX }: MouseEvent) {
      mouseDown = true;
      stopPlaying();
      updateFrame(clientX);
    }

    function handleMouseMove({ clientX }: MouseEvent) {
      if (mouseDown) updateFrame(clientX);
    }

    function handleMouseUp({ clientX }: MouseEvent) {
      if (!mouseDown) return;
      mouseDown = false;
      updateFrame(clientX);
    }

    button.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      button.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [domRect, frameCount, setFrame, stopPlaying]);

  const pointerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (mode !== AppMode.Playing) return;

    let mounted = true;
    const pointer = pointerRef.current!;
    const frameMs = Math.floor(frame * (1000 / frameRate));

    function render() {
      if (!mounted) return;

      const ms = frameMs + Date.now() - playStart;
      pointer.style.left = `${100 * ((ms % durationMs) / durationMs)}%`;

      requestAnimationFrame(render);
    }

    render();

    return () => {
      mounted = false;
    };
  }, [mode, playStart, frameRate, frame, durationMs]);

  return (
    <div className="relative h-full">
      <button
        className="appearance-none w-full h-full"
        ref={buttonRef}
        onKeyDown={(evt) => evt.preventDefault()}
      />
      <div className="absolute inset-0 px-0.5 pointer-events-none">
        <div className="relative h-full">
          <div
            className="absolute left-0 top-1/2"
            style={{
              left: `${100 * (frame / frameCount)}%`,
              width: domRect ? `${100 / frameCount}%` : 0,
            }}
            ref={pointerRef}
          >
            <div className="w-4 h-4 -mt-2 -ml-2 rounded-full bg-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TimeSlider: React.FC = () => {
  return (
    <div className="relative h-full">
      <Background />
      <Pointer />
    </div>
  );
};
