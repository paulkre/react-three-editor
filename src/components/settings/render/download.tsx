import React from "react";
import base64ToBlob from "b64-to-blob";
import { saveAs } from "file-saver";

import { AppMode, useStore } from "../../../state";
import { useRenderedFrame } from "./rendered-frame";
import { RenderButtons } from "./buttons";

const downloadCoolDown = 200;

export const DownloadRender: React.FC = () => {
  const [isRendering, renderNext] = useStore((state) => [
    state.mode === AppMode.Rendering,
    state.renderNext,
  ]);
  const getFrameData = useRenderedFrame();
  const lastDownloadTimeRef = React.useRef(0);

  React.useEffect(() => {
    if (!isRendering) return;

    const cooldown = Math.max(
      0,
      downloadCoolDown + lastDownloadTimeRef.current - Date.now()
    );

    setTimeout(() => {
      const { name, data } = getFrameData();
      saveAs(base64ToBlob(data, "image/png"), name);

      lastDownloadTimeRef.current = Date.now();
      renderNext();
    }, cooldown);
  }, [isRendering, getFrameData, renderNext]);

  return <RenderButtons />;
};
