import React from "react";
import { theme } from "../design/theme";

export interface MetricCounterProps {
  value: string;
  unit?: string;
  label: string;
  color?: string;
  marginTop?: number;
}

export const MetricCounter: React.FC<MetricCounterProps> = ({
  value,
  unit,
  label,
  color = "#38bdf8",
  marginTop = 120,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: marginTop,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 50,
        textShadow: "0 10px 40px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span
          style={{
            fontFamily: theme.fonts.caption,
            fontSize: 140,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            textShadow: "0 15px 60px rgba(56, 189, 248, 0.4)",
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: theme.fonts.headline,
              fontSize: 42,
              fontWeight: 800,
              color: color,
              letterSpacing: "-0.02em",
            }}
          >
            {unit}
          </span>
        )}
      </div>

      <span
        style={{
          fontFamily: theme.fonts.headline,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.24em",
          color: "#94a3b8",
          textTransform: "uppercase",
          marginTop: 8,
        }}
      >
        {label}
      </span>
    </div>
  );
};
