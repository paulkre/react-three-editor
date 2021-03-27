import React from "react";
import { saveAs } from "file-saver";

import { useStore } from "../../../state";

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
    renderNext,
  ] = useStore((state) => [
    state.duration.frames,
    state.canvas,
    state.frame,
    state.isRendering,
    state.startRendering,
    state.renderNext,
  ]);
  const lastDownloadTimeRef = React.useRef(0);

  React.useEffect(() => {
    if (!isRendering || !canvas) return;

    const now = Date.now();
    const cooldown = Math.max(
      0,
      downloadCoolDown + lastDownloadTimeRef.current - now
    );
    lastDownloadTimeRef.current = now;

    setTimeout(() => {
      const data = canvas
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, "");
      saveAs(
        base64ToBlob(data, "image/png"),
        `${frame
          .toString()
          .padStart(frameCount.toString().length + 1, "0")}.png`
      );

      renderNext();
    }, cooldown);
  }, [frameCount, isRendering, frame, renderNext, canvas]);

  return (
    <button
      className="border-2 border-gray-700 px-3 uppercase py-2 transition hover:bg-gray-300 hover:border-gray-300 hover:text-gray-900"
      disabled={!canvas}
      onClick={startRendering}
    >
      Start
    </button>
  );
};
