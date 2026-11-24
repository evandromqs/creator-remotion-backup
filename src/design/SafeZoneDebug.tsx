import React from "react";
import { AbsoluteFill } from "remotion";
import { safeZone, colors, FONT_CODE } from "./tokens";

interface SafeZoneDebugProps {
  enabled?: boolean;
}

export const SafeZoneDebug: React.FC<SafeZoneDebugProps> = ({
  enabled = false,
}) => {
  if (!enabled) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      {/* Guia da Zona Segura (800x1420) */}
      <div
        style={{
          position: "absolute",
          top: safeZone.top,
          bottom: safeZone.bottom,
          left: safeZone.left,
          right: safeZone.right,
          border: `2px dashed ${colors.BLUE}`,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            color: colors.BLUE,
            fontFamily: FONT_CODE,
            fontSize: 20,
            background: colors.BLACK,
            padding: "2px 8px",
          }}
        >
          SAFE ZONE (800x1420)
        </span>
      </div>

      {/* Linha base das legendas (y ≈ 1500) */}
      <div
        style={{
          position: "absolute",
          top: safeZone.captionsY,
          left: safeZone.left,
          right: safeZone.right,
          borderTop: `2px solid ${colors.RED}`,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -24,
            left: 10,
            color: colors.RED,
            fontFamily: FONT_CODE,
            fontSize: 16,
            background: colors.BLACK,
            padding: "2px 8px",
          }}
        >
          CAPTIONS BASELINE (Y ≈ 1500)
        </span>
      </div>
    </AbsoluteFill>
  );
};
