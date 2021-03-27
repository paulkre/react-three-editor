import React from "react";

import { Heading } from "..";
import { DownloadRender } from "./download";

export const RenderSettings: React.FC = () => {
  return (
    <>
      <Heading>Render</Heading>
      <DownloadRender />
    </>
  );
};
