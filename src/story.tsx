import type { Meta, Story } from "@storybook/react";
import type { Args as DefaultArgs } from "@storybook/addons";
import type { ContainerProps } from "react-three-fiber";

import React from "react";
import { defaultState } from "./state";
import { Editor } from "./components/editor";

type Args = {
  width: number;
  height: number;
  backgroundActive: boolean;
  backgroundColor: string;
  durationSeconds: number;
  frameRate: number;
  autoPlay: boolean;
  hideUI: boolean;
  renderTimeout: number;
};

export function createThreeStory<T = DefaultArgs>(
  meta: Meta<T>,
  canvasProps?: Omit<ContainerProps, "children">
): Meta<T & Args> {
  const Story: Story<T & Args> = ({
    width,
    height,
    backgroundActive,
    backgroundColor,
    durationSeconds,
    frameRate,
    autoPlay,
    hideUI,
    renderTimeout,
    ...props
  }) => (
    <Editor
      resolution={[width, height]}
      background={backgroundActive ? backgroundColor : null}
      durationSeconds={durationSeconds}
      frameRate={frameRate}
      autoPlay={autoPlay}
      hideUI={hideUI}
      canvas={canvasProps}
      renderTimeout={renderTimeout}
    >
      {meta.component && <meta.component {...props} />}
    </Editor>
  );

  return {
    ...meta,
    component: Story,
    argTypes: {
      ...meta.argTypes,
      width: {
        name: "Width",
        control: {
          type: "number",
          min: 1,
          step: 1,
        },
        defaultValue: defaultState.resolution[0],
      },
      height: {
        name: "Height",
        control: {
          type: "number",
          min: 1,
          step: 1,
        },
        defaultValue: defaultState.resolution[1],
      },
      backgroundActive: {
        name: "Background Active",
        control: {
          type: "boolean",
        },
        defaultValue: !!defaultState.background,
      },
      backgroundColor: {
        name: "Background Color",
        control: {
          type: "color",
        },
        defaultValue: defaultState.background,
      },
      durationSeconds: {
        name: "Duration (seconds)",
        control: {
          type: "number",
          min: 0.25,
        },
        defaultValue: defaultState.duration.seconds,
      },
      frameRate: {
        name: "Frame Rate",
        control: {
          type: "number",
          min: 1,
        },
        defaultValue: defaultState.frameRate,
      },
      autoPlay: {
        name: "Auto Play",
        control: {
          type: "boolean",
        },
        defaultValue: false,
      },
      hideUI: {
        name: "Hide UI",
        control: {
          type: "boolean",
        },
        defaultValue: false,
      },
      renderTimeout: {
        name: "Render Timeout",
        control: {
          type: "number",
          min: 0,
          step: 1,
        },
        defaultValue: defaultState.renderTimeout,
      },
    },
    args: {
      ...meta.args,
    },
  };
}
