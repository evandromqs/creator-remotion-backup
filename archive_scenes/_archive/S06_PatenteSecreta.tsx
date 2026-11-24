import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI, springPresets } from "../design/tokens";

export const S06_PatenteSecreta: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S06 representa A Constelação GPS (31 satélites a 20.000 km)
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({ frame: f, fps, config: springPresets.punchy });
  const satCount = Math.floor(interpolate(spr, [0, 1], [0, 31]));

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 180,
        paddingLeft: 70,
        paddingRight: 70,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          border: `3px solid ${colors.BLUE}`,
          borderRadius: 16,
          padding: "12px 28px",
          fontFamily: FONT_CODE,
          fontSize: 26,
          fontWeight: 800,
          color: colors.BLUE,
          backgroundColor: colors.BLACK,
          letterSpacing: "0.15em",
        }}
      >
        CONSTELAÇÃO ORBITAL NAVSTAR
      </div>

      {/* Grid Duplo de Números Gigantes */}
      <div
        style={{
          marginTop: 50,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 130, fontWeight: 900, color: colors.WHITE, lineHeight: 1 }}>
            {satCount}
          </span>
          <span style={{ fontFamily: FONT_CODE, fontSize: 26, fontWeight: 800, color: colors.BLUE, letterSpacing: "0.1em" }}>
            SATÉLITES ATIVOS
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 130, fontWeight: 900, color: colors.WHITE, lineHeight: 1 }}>
            20K
          </span>
          <span style={{ fontFamily: FONT_CODE, fontSize: 26, fontWeight: 800, color: colors.BLUE, letterSpacing: "0.1em" }}>
            KM DE ALTITUDE
          </span>
        </div>
      </div>

      {/* Círculo Orbital Minimalista */}
      <div
        style={{
          marginTop: 60,
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: `4px dashed ${colors.BLUE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          animation: "none",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: colors.BLACK,
            border: `6px solid ${colors.WHITE}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_CODE,
            fontSize: 24,
            fontWeight: 800,
            color: colors.WHITE,
          }}
        >
          TERRA
        </div>
      </div>
    </AbsoluteFill>
  );
};
