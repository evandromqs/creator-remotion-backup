import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { colors, FONT_CODE, FONT_UI } from "./design/tokens";
import { Background } from "./design/Background";
import { PostFX } from "./design/PostFX";
import { ThreeOrbitScene } from "./components/ThreeOrbitScene";

export const GPS15s: React.FC = () => {
  const frame = useCurrentFrame();

  // 15 segundos = 450 frames (@ 30 fps)
  // Corte 1 (0 a 140f): O Erro de 11 km
  // Corte 2 (140 a 300f): O Sputnik & A Órbita 3D
  // Corte 3 (300 a 450f): O Cálculo de Einstein (+38µs) & CTA

  const isCorte1 = frame < 140;
  const isCorte2 = frame >= 140 && frame < 300;
  const isCorte3 = frame >= 300;

  const currentEra = isCorte1 ? "alert" : isCorte2 ? "modern" : "alert";

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BLACK, overflow: "hidden" }}>
      {/* 1. Trilha de Narração (15 segundos) */}
      <Audio src={staticFile("narracao.mp3")} startFrom={0} endAt={450} />

      {/* 2. Fundo Minimalista */}
      <Background era={currentEra} />

      {/* 3. ILUSTRAÇÃO 3D THREE.JS EM TEMPO REAL */}
      <ThreeOrbitScene era={currentEra} />

      {/* 4. OVERLAYS MINIMALISTAS COM TIPOGRAFIA PESADA */}
      {isCorte1 && (
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
            zIndex: 10,
          }}
        >
          <div
            style={{
              border: `3px solid ${colors.RED}`,
              borderRadius: 16,
              padding: "14px 32px",
              fontFamily: FONT_CODE,
              fontSize: 28,
              fontWeight: 800,
              color: colors.RED,
              backgroundColor: colors.BLACK,
              letterSpacing: "0.15em",
              boxShadow: `0 0 40px ${colors.RED}`,
            }}
          >
            SEM EINSTEIN = GPS PERDIDO
          </div>

          <div
            style={{
              marginTop: 40,
              fontFamily: FONT_UI,
              fontSize: 160,
              fontWeight: 900,
              color: colors.WHITE,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textShadow: `0 0 50px rgba(255, 255, 255, 0.6)`,
            }}
          >
            +11 KM
          </div>

          <div
            style={{
              marginTop: 10,
              fontFamily: FONT_CODE,
              fontSize: 32,
              fontWeight: 800,
              color: colors.RED,
              letterSpacing: "0.1em",
            }}
          >
            DE ERRO TODO SANTO DIA!
          </div>
        </AbsoluteFill>
      )}

      {isCorte2 && (
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
            zIndex: 10,
          }}
        >
          <div
            style={{
              border: `3px solid ${colors.BLUE}`,
              borderRadius: 16,
              padding: "14px 32px",
              fontFamily: FONT_CODE,
              fontSize: 28,
              fontWeight: 800,
              color: colors.BLUE,
              backgroundColor: colors.BLACK,
              letterSpacing: "0.15em",
              boxShadow: `0 0 40px ${colors.BLUE}`,
            }}
          >
            CONSTELAÇÃO ORBITAL 3D
          </div>

          <div
            style={{
              marginTop: 40,
              fontFamily: FONT_UI,
              fontSize: 130,
              fontWeight: 900,
              color: colors.WHITE,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            31 SATÉLITES
          </div>

          <div
            style={{
              marginTop: 10,
              fontFamily: FONT_CODE,
              fontSize: 32,
              fontWeight: 800,
              color: colors.BLUE,
              letterSpacing: "0.1em",
            }}
          >
            A 20.000 KM DE ALTITUDE
          </div>
        </AbsoluteFill>
      )}

      {isCorte3 && (
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
            zIndex: 10,
          }}
        >
          <div
            style={{
              border: `3px solid ${colors.WHITE}`,
              borderRadius: 16,
              padding: "14px 32px",
              fontFamily: FONT_CODE,
              fontSize: 28,
              fontWeight: 800,
              color: colors.WHITE,
              backgroundColor: colors.BLACK,
              letterSpacing: "0.15em",
            }}
          >
            EQUAÇÃO RELATIVÍSTICA
          </div>

          <div
            style={{
              marginTop: 40,
              fontFamily: FONT_UI,
              fontSize: 160,
              fontWeight: 900,
              color: colors.RED,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textShadow: `0 0 60px ${colors.RED}`,
            }}
          >
            +38 µs
          </div>

          <div
            style={{
              marginTop: 16,
              border: `3px solid ${colors.RED}`,
              borderRadius: 20,
              padding: "16px 44px",
              fontFamily: FONT_CODE,
              fontSize: 28,
              fontWeight: 800,
              color: colors.WHITE,
              backgroundColor: colors.BLACK,
            }}
          >
            RELÓGIOS DESACELERADOS NO ESPAÇO
          </div>
        </AbsoluteFill>
      )}

      {/* 5. Pós-processamento */}
      <PostFX chromaticShift={currentEra === "alert" ? 3 : 0} />
    </AbsoluteFill>
  );
};
