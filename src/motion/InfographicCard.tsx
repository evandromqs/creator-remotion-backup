import React from "react";
import { useCurrentFrame } from "remotion";
import { MOTION_PALETTE, MOTION_SHADOWS } from "./tokens";
import { springPop, floatLoop, tiltLoop, shimmerGlow } from "./presets";

export interface InfographicCardProps {
  delay?: number;
  title: string;
  value?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accent?: string;
  badge?: string;
  style?: React.CSSProperties;
}

export const InfographicCard: React.FC<InfographicCardProps> = ({
  delay = 0,
  title,
  value,
  subtitle,
  icon,
  accent = MOTION_PALETTE.accentAmber,
  badge,
  style,
}) => {
  const frame = useCurrentFrame();
  const pop = springPop(frame, 30, delay);

  // Regra dos 3 segundos: Micro-animações contínuas em repouso
  const floatY = floatLoop(frame + delay * 5, 36, 6);
  const tilt = tiltLoop(frame + delay * 8, 48, 1.2);
  const glowOp = shimmerGlow(frame, 28, 0.25, 0.65);

  if (pop <= 0.01) return null;

  return (
    <div
      style={{
        transform: `translateY(${floatY + (1 - pop) * 30}px) rotate(${tilt}deg) scale(${pop})`,
        opacity: pop,
        background: "rgba(19, 27, 46, 0.92)",
        backdropFilter: "blur(14px)",
        border: `2px solid ${accent}`,
        borderRadius: "20px",
        padding: "24px 32px",
        boxShadow: `${MOTION_SHADOWS.card}, 0 0 30px ${accent}${Math.round(glowOp * 255).toString(16).padStart(2, "0")}`,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {icon && (
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: `${accent}22`,
                display: "grid",
                placeItems: "center",
                color: accent,
              }}
            >
              {icon}
            </div>
          )}
          <span style={{ fontSize: "20px", fontWeight: 700, color: MOTION_PALETTE.textWhite, letterSpacing: "-0.02em" }}>
            {title}
          </span>
        </div>

        {badge && (
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "999px",
              background: accent,
              color: "#000",
              letterSpacing: "0.05em",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {value && (
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: accent,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
      )}

      {subtitle && (
        <div style={{ fontSize: "17px", color: MOTION_PALETTE.textMuted, fontWeight: 500, lineHeight: 1.4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
