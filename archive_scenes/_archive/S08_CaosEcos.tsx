import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps, at } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";
import { GlitchHit, Shake } from "../fx";

export const S08_CaosEcos: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S08 representa O Tempo Enlouqueceu (Desvio de tempo no espaço)
  const f = useCurrentFrame();

  const fEnlouqueceu = Math.max(0, at("enlouqueceu", 0) - from);
  const isEnlouq = f >= fEnlouqueceu;

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
          border: `3px solid ${colors.RED}`,
          borderRadius: 16,
          padding: "12px 28px",
          fontFamily: FONT_CODE,
          fontSize: 26,
          fontWeight: 800,
          color: colors.RED,
          backgroundColor: colors.BLACK,
          letterSpacing: "0.15em",
          boxShadow: `0 0 35px ${colors.RED}`,
        }}
      >
        ANOMALIA RELATIVÍSTICA
      </div>

      <div style={{ marginTop: 60 }}>
        <Shake frame={f} startFrame={fEnlouqueceu} duration={20} amplitude={24}>
          <GlitchHit frame={f} startFrame={fEnlouqueceu} duration={16} intensity={25}>
            <div
              style={{
                fontFamily: FONT_UI,
                fontSize: 90,
                fontWeight: 900,
                color: colors.WHITE,
                textAlign: "center",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
            >
              O TEMPO NO ESPAÇO ENLOUQUECEU!
            </div>
          </GlitchHit>
        </Shake>
      </div>

      {/* Relógio Quebrado / Alerta Vermelho */}
      <div
        style={{
          marginTop: 60,
          border: `6px solid ${colors.RED}`,
          borderRadius: 24,
          padding: "24px 60px",
          backgroundColor: colors.BLACK,
          fontFamily: FONT_CODE,
          fontSize: 48,
          fontWeight: 900,
          color: colors.RED,
          letterSpacing: "0.08em",
          boxShadow: `0 0 50px ${colors.RED}`,
        }}
      >
        ERR: TIME_DESYNC
      </div>
    </AbsoluteFill>
  );
};
