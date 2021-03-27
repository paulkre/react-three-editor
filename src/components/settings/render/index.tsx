import React from "react";

import { Heading } from "..";
import { AppMode, useStore } from "../../../state";
import { RenderMode } from "../../../state/rendering";
import { DownloadRender } from "./download";

export const RenderSettings: React.FC = () => {
  const [renderMode, setRenderMode] = useStore((state) => [
    state.renderMode,
    state.setRenderMode,
  ]);

  return (
    <>
      <Heading>Render</Heading>
      <div className="mb-4">
        <span className="mr-3">Mode:</span>
        <select
          className="cursor-pointer bg-transparent border-2 border-gray-700 text-white"
          onChange={({ target }) =>
            setRenderMode(parseInt(target.value) as RenderMode)
          }
          value={renderMode}
        >
          <option value={RenderMode.Download}>Download</option>
          <option value={RenderMode.Server}>Server</option>
        </select>
      </div>
      <DownloadRender />
    </>
  );
};
