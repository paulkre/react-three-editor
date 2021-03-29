import React from "react";
import base64ToBlob from "b64-to-blob";
import { saveAs } from "file-saver";

import { AppMode, useStore } from "../../../state";
import { useRenderedFrame } from "./rendered-frame";
import { RenderButtons } from "./buttons";

const downloadCoolDown = 200;

export const DownloadRender: React.FC = () => {
  const [{ mode }, { renderNext }] = useStore();
  const getFrameData = useRenderedFrame();
  const lastDownloadTimeRef = React.useRef(0);

  const isRendering = mode === AppMode.Rendering;

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
