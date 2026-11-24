import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneProps, at } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI, springPresets } from "../design/tokens";
import { GlitchHit, PunchIn, Shake } from "../fx";

export const S01_Hook: React.FC<SceneProps> = ({ from, to: _to }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fEinstein = Math.max(0, at("Einstein", 0) - from);
  const isEinsteinActive = f >= fEinstein;

  const radarSpr = spring({
    frame: f,
    fps,
    config: springPresets.snappy,
  });

  const pulse = (f % 30) / 30;
  const pulseScale = interpolate(pulse, [0, 1], [0.8, 1.4]);
  const pulseOpacity = interpolate(pulse, [0, 1], [0.8, 0]);

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
      {/* 1. Header Minimalista Tech */}
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          border: `3px solid ${isEinsteinActive ? colors.RED : colors.BLUE}`,
          borderRadius: 20,
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.BLACK,
          boxShadow: isEinsteinActive ? `0 0 40px ${colors.RED}` : `0 0 35px rgba(30, 107, 255, 0.4)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: isEinsteinActive ? colors.RED : colors.BLUE,
              boxShadow: `0 0 16px ${isEinsteinActive ? colors.RED : colors.BLUE}`,
            }}
          />
          <span style={{ fontFamily: FONT_CODE, fontSize: 26, fontWeight: 800, color: colors.WHITE, letterSpacing: "0.1em" }}>
            {isEinsteinActive ? "ALERTA: FÍSICA MODERNA" : "GPS â€¢ SINAL ATIVO"}
          </span>
        </div>
        <span style={{ fontFamily: FONT_CODE, fontSize: 26, fontWeight: 800, color: isEinsteinActive ? colors.RED : colors.BLUE }}>
          L1: 1575 MHz
        </span>
      </div>

      {/* 2. Radar Geométrico Central */}
      <div
        style={{
          marginTop: 60,
          width: 480,
          height: 480,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(radarSpr, [0, 1], [0.8, 1])})`,
        }}
      >
        {/* Pulsos de radar */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: `3px solid ${isEinsteinActive ? colors.RED : colors.BLUE}`,
            transform: `scale(${pulseScale})`,
            opacity: pulseOpacity,
          }}
        />

        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `6px solid ${isEinsteinActive ? colors.RED : colors.BLUE}`,
            backgroundColor: colors.BLACK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isEinsteinActive ? `0 0 60px ${colors.RED}` : `0 0 50px ${colors.BLUE}`,
            position: "relative",
          }}
        >
          {/* Grade de mira reticular */}
          <div style={{ position: "absolute", width: "100%", height: 2, backgroundColor: "rgba(255,255,255,0.2)" }} />
          <div style={{ position: "absolute", height: "100%", width: 2, backgroundColor: "rgba(255,255,255,0.2)" }} />
          
          {/* Ponto de localização */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: colors.WHITE,
              boxShadow: `0 0 24px ${colors.WHITE}`,
            }}
          />
        </div>
      </div>

      {/* 3. Callout de Impacto Brutalista */}
      <div style={{ marginTop: 50, position: "relative", opacity: isEinsteinActive ? 1 : 0 }}>
        <Shake frame={f} startFrame={fEinstein} duration={16} amplitude={20}>
          <PunchIn frame={f} startFrame={fEinstein} duration={18} scaleAmount={0.3}>
            <div
              style={{
                backgroundColor: colors.RED,
                border: `4px solid ${colors.WHITE}`,
                borderRadius: 20,
                padding: "20px 48px",
                fontFamily: FONT_UI,
                fontSize: 64,
                fontWeight: 900,
                color: colors.WHITE,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                boxShadow: `0 0 60px ${colors.RED}`,
              }}
            >
              SEM EINSTEIN?
            </div>
          </PunchIn>
        </Shake>
      </div>
    </AbsoluteFill>
  );
};
