import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { DynamicMain } from "./DynamicMain";
import { GPS15s } from "./GPS15s";
import scenesData from "./data/scenes.json";

import { Style1CleoAbram } from "./styles/Style1CleoAbram";
import { Style2VoxHarris } from "./styles/Style2VoxHarris";
import { Style3Blueprint } from "./styles/Style3Blueprint";
import { StyleAppleSpline } from "./styles/StyleAppleSpline";

export const VideoPropsSchema = z.object({
  audioSrc: z.string().default("narracao.mp3"),
  title: z.string().default(scenesData.meta.title),
  enableSafeZone: z.boolean().default(false),
});

export type VideoProps = z.infer<typeof VideoPropsSchema>;

export const Root: React.FC = () => {
  return (
    <>
      {/* Composição Dinâmica Principal Orientada estritamente por scenes.json */}
      <Composition
        id="Main"
        component={DynamicMain}
        fps={scenesData.meta.fps}
        width={scenesData.meta.width}
        height={scenesData.meta.height}
        durationInFrames={scenesData.meta.durationInFrames}
        defaultProps={{}}
      />

      {/* Prancha Visual: Estilo Apple / Spline Minimalista */}
      <Composition
        id="Style-AppleSpline"
        component={StyleAppleSpline}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={120}
        defaultProps={{}}
      />

      {/* 3 Pranchas Visuais de Comparação de Estilo */}
      <Composition
        id="Style1-CleoAbram"
        component={Style1CleoAbram}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={100}
        defaultProps={{}}
      />
      <Composition
        id="Style2-VoxHarris"
        component={Style2VoxHarris}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={100}
        defaultProps={{}}
      />
      <Composition
        id="Style3-Blueprint"
        component={Style3Blueprint}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={100}
        defaultProps={{}}
      />

      {/* Referência Curta 15s */}
      <Composition
        id="GPS15s"
        component={GPS15s}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={450}
        defaultProps={{}}
      />
    </>
  );
};
