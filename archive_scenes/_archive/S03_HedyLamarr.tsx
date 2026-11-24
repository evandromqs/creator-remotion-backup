import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneProps, at } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI, springPresets } from "../design/tokens";

export const S03_HedyLamarr: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S03 agora representa a Guerra Fria / Sputnik 1957
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fSputnik = Math.max(0, at("Sputnik", 0) - from);
  const isSputnikActive = f >= fSputnik;

  const yearSpr = spring({
    frame: f,
    fps,
    config: springPresets.punchy,
  });

  const yearVal = Math.floor(interpolate(yearSpr, [0, 1], [2026, 1957]));

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
        GUERRA FRIA â€¢ MARCO HISTÓRICO
      </div>

      {/* Odômetro 1957 */}
      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_UI,
          fontSize: 180,
          fontWeight: 900,
          color: colors.WHITE,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          textShadow: `0 0 50px rgba(30, 107, 255, 0.4)`,
        }}
      >
        {yearVal}
      </div>

      {/* Ilustração Minimalista do Satélite Sputnik */}
      <div
        style={{
          marginTop: 50,
          width: 440,
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <svg width="400" height="260" viewBox="0 0 400 260" fill="none">
          {/* Órbita elíptica */}
          <ellipse cx="200" cy="130" rx="180" ry="60" stroke={colors.BLUE} strokeWidth="3" strokeDasharray="8 8" opacity="0.6" />
          
          {/* Esfera Sputnik central */}
          <circle cx="200" cy="130" r="44" fill={colors.BLACK} stroke={colors.WHITE} strokeWidth="6" />
          
          {/* 4 Antenas longas */}
          <line x1="165" y1="100" x2="60" y2="20" stroke={isSputnikActive ? colors.RED : colors.BLUE} strokeWidth="5" strokeLinecap="round" />
          <line x1="235" y1="100" x2="340" y2="20" stroke={isSputnikActive ? colors.RED : colors.BLUE} strokeWidth="5" strokeLinecap="round" />
          <line x1="165" y1="160" x2="50" y2="240" stroke={isSputnikActive ? colors.RED : colors.BLUE} strokeWidth="5" strokeLinecap="round" />
          <line x1="235" y1="160" x2="350" y2="240" stroke={isSputnikActive ? colors.RED : colors.BLUE} strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      <div
        style={{
          marginTop: 30,
          fontFamily: FONT_UI,
          fontSize: 54,
          fontWeight: 900,
          color: isSputnikActive ? colors.RED : colors.WHITE,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        SPUTNIK-1 EM ÓRBITA
      </div>
    </AbsoluteFill>
  );
};
