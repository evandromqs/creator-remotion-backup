import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneProps, at } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI, springPresets } from "../design/tokens";
import { PunchIn, Shake } from "../fx";

export const S02_Origem1941: React.FC<SceneProps> = ({ from, to: _to }) => {
  // Agora S02 representa o Desvio de 11 KM
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const f11km = Math.max(0, at("onze", 0) - from);
  const is11Active = f >= f11km;

  const countSpr = spring({
    frame: f,
    fps,
    config: springPresets.punchy,
  });

  const kmVal = Math.min(11.4, Number((interpolate(countSpr, [0, 1], [0, 11.4])).toFixed(1)));

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 200,
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
          fontSize: 28,
          fontWeight: 800,
          color: colors.RED,
          backgroundColor: colors.BLACK,
          letterSpacing: "0.15em",
          boxShadow: `0 0 30px rgba(255, 31, 61, 0.4)`,
        }}
      >
        ERRO ACUMULADO DIÁRIO
      </div>

      {/* Número Monumental */}
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_UI,
            fontSize: 160,
            fontWeight: 900,
            color: colors.WHITE,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            textShadow: `0 0 50px rgba(255, 255, 255, 0.5)`,
          }}
        >
          +{kmVal}
        </span>
        <span
          style={{
            marginTop: 10,
            fontFamily: FONT_UI,
            fontSize: 64,
            fontWeight: 900,
            color: colors.RED,
            letterSpacing: "0.1em",
          }}
        >
          QUILÔMETROS / DIA
        </span>
      </div>

      {/* Box de Impacto */}
      <div style={{ marginTop: 60, opacity: is11Active ? 1 : 0 }}>
        <Shake frame={f} startFrame={f11km} duration={14} amplitude={16}>
          <PunchIn frame={f} startFrame={f11km} duration={18} scaleAmount={0.25}>
            <div
              style={{
                backgroundColor: colors.BLACK,
                border: `4px solid ${colors.RED}`,
                borderRadius: 20,
                padding: "20px 40px",
                fontFamily: FONT_CODE,
                fontSize: 32,
                fontWeight: 800,
                color: colors.WHITE,
                textAlign: "center",
                boxShadow: `0 0 40px ${colors.RED}`,
              }}
            >
              SEM FÍSICA = ROTA INÚTIL
            </div>
          </PunchIn>
        </Shake>
      </div>
    </AbsoluteFill>
  );
};
