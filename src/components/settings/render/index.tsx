import React from "react";

import { Heading } from "..";
import { AppMode, useStore } from "../../../state";
import { RenderMode } from "../../../state/rendering";
import { DownloadRender } from "./download";
import { ServerRender } from "./server";

export const RenderSettings: React.FC = () => {
  const [renderMode, setRenderMode, isRendering] = useStore((state) => [
    state.renderMode,
    state.setRenderMode,
    state.mode === AppMode.Rendering,
  ]);

  return (
    <>
      <Heading>Render</Heading>
      <div className="mb-4">
        <span className="mr-3">Mode:</span>
        <select
          className="cursor-pointer bg-transparent border-2 border-gray-400 text-gray-400 font-semibold transition hover:bg-gray-500 hover:border-gray-500 hover:text-gray-50"
          onChange={({ target }) =>
            setRenderMode(parseInt(target.value) as RenderMode)
          }
          value={renderMode}
          disabled={isRendering}
        >
          <option value={RenderMode.Download}>Download</option>
          <option value={RenderMode.Server}>Server</option>
        </select>
      </div>
      {renderMode === RenderMode.Download ? (
        <DownloadRender />
      ) : (
        <ServerRender />
      )}
    </>
  );
};
