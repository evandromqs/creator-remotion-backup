import React from "react";
import { interpolate, random } from "remotion";
import { colors } from "../design/tokens";

interface ParticleBurstProps {
  frame: number;
  startFrame: number;
  count?: number;
  color?: string;
  maxDistance?: number;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
  frame,
  startFrame,
  count = 24,
  color = colors.BLUE,
  maxDistance = 240,
}) => {
  const rel = frame - startFrame;
  const duration = 22;

  if (rel < 0 || rel >= duration) {
    return null;
  }

  const progress = interpolate(rel, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(rel, [0, duration * 0.4, duration], [1, 0.9, 0], {
    extrapolateRight: "clamp",
  });

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI + random(`angle-4c-${i}`) * 0.4;
    const speed = 0.6 + random(`speed-4c-${i}`) * 0.7;
    const distance = progress * maxDistance * speed;
    const size = Math.floor(4 + random(`size-4c-${i}`) * 10);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { id: i, x, y, size };
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1,
        height: 1,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: color,
            opacity,
            boxShadow: `0 0 12px ${color}`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};
