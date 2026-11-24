import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI, springPresets } from "../design/tokens";

export const S05_SaltoFrequencia: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S05 representa A Sacada Genial (Inversão do Doppler para achar qualquer ponto)
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({ frame: f, fps, config: springPresets.snappy });

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
        A SACADA MATEMÁTICA
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_UI,
          fontSize: 88,
          fontWeight: 900,
          color: colors.WHITE,
          textAlign: "center",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          textTransform: "uppercase",
        }}
      >
        INVERSÃO DE CÁLCULO
      </div>

      {/* Diagrama: Satélite no topo apontando para a Terra no fundo */}
      <div
        style={{
          marginTop: 50,
          width: 500,
          height: 440,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Satélite */}
        <div
          style={{
            border: `4px solid ${colors.BLUE}`,
            borderRadius: 20,
            padding: "16px 36px",
            backgroundColor: colors.BLACK,
            fontFamily: FONT_CODE,
            fontSize: 28,
            fontWeight: 800,
            color: colors.WHITE,
            boxShadow: `0 0 35px ${colors.BLUE}`,
          }}
        >
          🛰️ SATÉLITE EM ÓRBITA
        </div>

        {/* Linhas de Mira Triangulada */}
        <svg width="400" height="200" viewBox="0 0 400 200" fill="none">
          <line x1="200" y1="0" x2="200" y2="180" stroke={colors.WHITE} strokeWidth="6" strokeDasharray="12 12" />
          <polygon points="190,170 200,195 210,170" fill={colors.WHITE} />
        </svg>

        {/* Ponto na Terra */}
        <div
          style={{
            border: `4px solid ${colors.RED}`,
            borderRadius: 20,
            padding: "16px 36px",
            backgroundColor: colors.BLACK,
            fontFamily: FONT_CODE,
            fontSize: 28,
            fontWeight: 800,
            color: colors.RED,
            boxShadow: `0 0 40px ${colors.RED}`,
          }}
        >
          📍 QUALQUER PONTO NA TERRA
        </div>
      </div>
    </AbsoluteFill>
  );
};
