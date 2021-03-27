import React from "react";

import { AppMode, useStore } from "../../../state";
import { useRenderedFrame } from "./rendered-frame";
import { RenderButtons } from "./buttons";
import { TextField } from "../text-field";

function useWebSocket(url: string) {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [tryCount, setTryCount] = React.useState(0);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    function tryReconnecting() {
      setTimeout(() => {
        if (!mounted) return;
        setTryCount(tryCount + 1);
      }, 1000);
    }

    try {
      const ws = new WebSocket(url);
      setSocket(ws);

      ws.addEventListener("close", () => {
        if (!mounted) return;
        setSocket(null);
        setConnected(false);
        tryReconnecting();
      });

      return () => {
        mounted = false;
        if (ws.readyState !== WebSocket.CLOSED) ws.close();
      };
    } catch {
      tryReconnecting();
    }

    return () => void (mounted = false);
  }, [tryCount, url]);

  React.useEffect(() => {
    if (!socket) return;
    const ws = socket;

    function handleConnection() {
      setConnected(true);
    }

    if (ws.readyState === WebSocket.OPEN) handleConnection();
    else ws.addEventListener("open", handleConnection);

    return () => ws.removeEventListener("open", handleConnection);
  }, [socket]);

  return connected ? socket : null;
}

export const ServerRender: React.FC = () => {
  const [isRendering, renderNext, outDir, setOutDir] = useStore((state) => [
    state.mode === AppMode.Rendering,
    state.renderNext,
    state.outDir,
    state.setOutDir,
  ]);
  const getFrameData = useRenderedFrame();
  const socket = useWebSocket("ws://127.0.0.1:3001");

  React.useEffect(() => {
    if (!isRendering || !socket) return;

    setTimeout(() => {
      const { name, data } = getFrameData();
      socket.send(
        JSON.stringify({
          path: `${
            outDir[outDir.length - 1] === "/" ? outDir : `${outDir}/`
          }${name}`,
          data,
        })
      );
    }, 0);
  }, [isRendering, socket, outDir, getFrameData]);

  React.useEffect(() => {
    if (!isRendering || !socket) return;

    socket.addEventListener("message", renderNext);
    return () => socket.removeEventListener("message", renderNext);
  }, [isRendering, socket, renderNext]);

  return socket ? (
    <>
      <div className="mb-4">
        <TextField
          placeholder="Path"
          value={outDir}
          onValue={setOutDir}
          readOnly={isRendering}
        />
      </div>
      <RenderButtons />
    </>
  ) : (
    <span>Connecting...</span>
  );
};
