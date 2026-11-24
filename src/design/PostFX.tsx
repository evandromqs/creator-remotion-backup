import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "./tokens";

interface PostFXProps {
  chromaticShift?: number;
  showScanlines?: boolean;
}

export const PostFX: React.FC<PostFXProps> = ({
  chromaticShift = 0,
  showScanlines = true,
}) => {
  const frame = useCurrentFrame();
  const noiseSeed = (frame * 19) % 100;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 990 }}>
      {/* 1. Vinheta escura */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, #05070A 100%)",
        }}
      />

      {/* 2. Scanlines CRT */}
      {showScanlines && (
        <AbsoluteFill
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(5,7,10,0.18) 0px, rgba(5,7,10,0.18) 2px, transparent 2px, transparent 6px)",
            opacity: 0.7,
          }}
        />
      )}

      {/* 3. Aberração Cromática restrita em AZUL e VERMELHO */}
      {chromaticShift > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: 0.45,
            filter: `drop-shadow(${chromaticShift}px 0px 0px ${colors.RED}) drop-shadow(-${chromaticShift}px 0px 0px ${colors.BLUE})`,
          }}
        />
      )}

      {/* 4. Grão cinematográfico procedural em SVG */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.05 }}
      >
        <filter id="grain-4c">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            seed={noiseSeed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-4c)" />
      </svg>
    </AbsoluteFill>
  );
};
