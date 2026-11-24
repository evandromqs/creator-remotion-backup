import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import scenesData from "./data/scenes.json";
import { DynamicCaptions } from "./components/DynamicCaptions";
import { getSceneComponent } from "./components/SceneRegistry";

export const DynamicMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#090c13", overflow: "hidden" }}>
      {/* 1. Trilha de Narração Oficial */}
      {scenesData.audio?.narration && (
        <Audio src={staticFile("narracao.mp3")} />
      )}

      {/* 2. Renderização Dinâmica de Cenas Conforme scenes.json */}
      {scenesData.scenes.map((scene) => {
        const SceneComponent = getSceneComponent(scene.component);
        return (
          <Sequence
            key={scene.id}
            from={scene.from}
            durationInFrames={scene.durationInFrames}
            layout="none"
          >
            <SceneComponent scene={scene} />
          </Sequence>
        );
      })}

      {/* 4. Legendas Estilo TikTok Sincronizadas */}
      <DynamicCaptions />
    </AbsoluteFill>
  );
};
