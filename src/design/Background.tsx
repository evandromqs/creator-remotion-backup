import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, FONT_CODE } from "./tokens";

interface BackgroundProps {
  era?: "vintage" | "modern" | "alert";
}

const TELEMETRY_LINES = [
  "US_PATENT_2292387 // HEDY LAMARR & GEORGE ANTHEIL 1941",
  "FHSS_PROTOCOL: FREQUENCY HOPPING SPREAD SPECTRUM",
  "CSIRO_1992: FAST FOURIER TRANSFORM // BLACK HOLE ECHO",
  "01010111 01001001 01000110 01001001",
  "IEEE_802_11B: 2.4 GHz BAND // MULTIPATH RESOLVED",
  "CHANNEL_HOP: [CH_01 -> CH_06 -> CH_11 -> CH_03]",
  "HOLLYWOOD_LAB_1941: SECRET COMMUNICATION SYSTEM",
  "WLAN_ALLIANCE_1999: WI-FI RHYMES WITH HI-FI",
  "10110011 00101101 11001010 00010011",
  "GLOBAL_THROUGHPUT: 5.0 GHz / 6.0 GHz ULTRA-WIDEBAND",
];

export const Background: React.FC<BackgroundProps> = ({ era = "modern" }) => {
  const frame = useCurrentFrame();

  const isVintage = era === "vintage";
  const isAlert = era === "alert";

  const accentColor = isAlert
    ? colors.RED
    : isVintage
    ? colors.WHITE
    : colors.BLUE;

  const gridOpacity = isVintage ? 0.08 : isAlert ? 0.12 : 0.09;
  const codeOpacity = isVintage ? 0.14 : isAlert ? 0.18 : 0.12;

  // Parallax suave determinístico
  const offsetY = (frame * 1.2) % 240;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BLACK,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* 1. Grade geométrica de fundo */}
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <pattern
            id="bg-grid-pattern-4c"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${offsetY})`}
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={accentColor}
              strokeWidth="1.5"
              strokeOpacity={gridOpacity}
            />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#bg-grid-pattern-4c)" />
      </svg>

      {/* 2. Telemetria histórica/técnica em parallax lento */}
      <div
        style={{
          position: "absolute",
          top: -100 - offsetY * 0.7,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          gap: 75,
          fontFamily: FONT_CODE,
          fontSize: 22,
          color: accentColor,
          opacity: codeOpacity,
          letterSpacing: "0.15em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {[...TELEMETRY_LINES, ...TELEMETRY_LINES, ...TELEMETRY_LINES].map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
