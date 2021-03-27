import React from "react";
import { saveAs } from "file-saver";

import { AppMode, useStore } from "../../../state";
import { Button, ButtonVariant } from "../button";

function base64ToBlob(b64Data: string, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

const downloadCoolDown = 200;

export const DownloadRender: React.FC = () => {
  const [
    frameCount,
    canvas,
    frame,
    isRendering,
    startRendering,
    stopRendering,
    renderNext,
  ] = useStore((state) => [
    state.duration.frames,
    state.canvas,
    state.frame,
    state.mode === AppMode.Rendering,
    state.startRendering,
    state.stopRendering,
    state.renderNext,
  ]);
  const lastDownloadTimeRef = React.useRef(0);

  React.useEffect(() => {
    if (!isRendering || !canvas) return;

    const cooldown = Math.max(
      0,
      downloadCoolDown + lastDownloadTimeRef.current - Date.now()
    );
    console.log(cooldown);

    setTimeout(() => {
      const data = canvas
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, "");
      saveAs(
        base64ToBlob(data, "image/png"),
        `${(frame + 1)
          .toString()
          .padStart(frameCount.toString().length + 1, "0")}.png`
      );

      lastDownloadTimeRef.current = Date.now();
      renderNext();
    }, cooldown);
  }, [frameCount, isRendering, frame, renderNext, canvas]);

  return isRendering ? (
    <Button onClick={stopRendering} variant={ButtonVariant.Cancel}>
      Stop
    </Button>
  ) : (
    <Button onClick={startRendering}>Start</Button>
  );
};
