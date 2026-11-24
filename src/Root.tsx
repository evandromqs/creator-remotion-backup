import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { DynamicMain } from "./DynamicMain";
import scenesData from "./data/scenes.json";

export const VideoPropsSchema = z.object({
  audioSrc: z.string().default("narracao.mp3"),
  title: z.string().default(scenesData.meta.title),
  enableSafeZone: z.boolean().default(false),
});

export type VideoProps = z.infer<typeof VideoPropsSchema>;

export const Root: React.FC = () => {
  return (
    <>
      {/* Composição Dinâmica Principal — Modern Explainer 2D */}
      <Composition
        id="Main"
        component={DynamicMain}
        fps={scenesData.meta.fps}
        width={scenesData.meta.width}
        height={scenesData.meta.height}
        durationInFrames={scenesData.meta.durationInFrames}
        defaultProps={{}}
      />
    </>
  );
};
