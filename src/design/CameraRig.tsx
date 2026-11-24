import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { springPresets } from "./tokens";

interface CameraRigProps {
  children: React.ReactNode;
  punchTriggers?: number[]; // Frames absolutos de impacto para punch-in
  shakeTriggers?: Array<{ frame: number; intensity?: number }>;
  baseScale?: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  punchTriggers = [],
  shakeTriggers = [],
  baseScale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Zoom contínuo lento (1.0 -> 1.06 ao longo do vídeo para retenção subliminar)
  const continuousZoom = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.06],
    { extrapolateRight: "clamp" }
  );

  // 2. Punch-in com spring determinístico nos beats de ênfase
  let punchBonus = 0;
  for (const trigger of punchTriggers) {
    if (frame >= trigger && frame <= trigger + 30) {
      const rel = frame - trigger;
      const spr = spring({
        frame: rel,
        fps,
        config: springPresets.punchy,
      });
      // Sobe até ~0.10 e decai suavemente
      const decay = interpolate(rel, [0, 10, 30], [1, 0.4, 0], {
        extrapolateRight: "clamp",
      });
      const effect = spr * 0.12 * decay;
      if (effect > punchBonus) {
        punchBonus = effect;
      }
    }
  }

  // 3. Shake determinístico via noise2D (sem Math.random)
  let shakeX = 0;
  let shakeY = 0;
  for (const { frame: sFrame, intensity = 12 } of shakeTriggers) {
    if (frame >= sFrame && frame <= sFrame + 24) {
      const rel = frame - sFrame;
      const decay = interpolate(rel, [0, 24], [1, 0], {
        extrapolateRight: "clamp",
      });
      const nX = noise2D("camera-shake-x", frame * 0.75, 0);
      const nY = noise2D("camera-shake-y", 0, frame * 0.75);
      shakeX += nX * intensity * decay;
      shakeY += nY * intensity * decay;
    }
  }

  const finalScale = baseScale * (continuousZoom + punchBonus);

  return (
    <AbsoluteFill
      style={{
        transformOrigin: "50% 45%",
        transform: `translate3d(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px, 0px) scale(${finalScale.toFixed(4)})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
