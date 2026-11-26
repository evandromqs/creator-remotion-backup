import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { DynamicMain } from "./DynamicMain";
import { Short30s } from "./Short30s";
import { FlatShort30s } from "./flat/FlatShort30s";
import { FlatMain } from "./flat/FlatMain";
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

      {/* SHORT 30s — Corte Direcionado (9 cenas / 900 frames) */}
      <Composition
        id="Short30s"
        component={Short30s}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={900}
        defaultProps={{}}
      />

      {/* FLAT SHORT 30s — Flat 2.5D recriado do zero, sincronizado com a narração */}
      <Composition
        id="FlatShort30s"
        component={FlatShort30s}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={900}
        defaultProps={{}}
      />

      {/* FLAT MAIN — Vídeo Completo (18 cenas / 3400 frames / 113.3s) em Solid Flat 2.5D */}
      <Composition
        id="FlatMain"
        component={FlatMain}
        fps={scenesData.meta.fps}
        width={scenesData.meta.width}
        height={scenesData.meta.height}
        durationInFrames={scenesData.meta.durationInFrames}
        defaultProps={{}}
      />
    </>
  );
};
