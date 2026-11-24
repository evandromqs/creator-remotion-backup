import { interpolate, spring } from "remotion";

/**
 * Entrada elástica com overshoot suave (Pop In)
 */
export function springPop(
  frame: number,
  fps = 30,
  delay = 0,
  damping = 13,
  stiffness = 110,
  mass = 0.8
) {
  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness, mass },
  });
  return interpolate(spr, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Fade In suave por opacidade
 */
export function fadeIn(frame: number, delay = 0, duration = 15) {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Slide direcional suave de baixo para cima
 */
export function slideUp(frame: number, fps = 30, delay = 0, distance = 60) {
  const spr = springPop(frame, fps, delay);
  return interpolate(spr, [0, 1], [distance, 0]);
}

/**
 * Traçado progressivo de linhas SVG (strokeDashoffset)
 */
export function drawOn(frame: number, delay = 0, duration = 25, totalLength = 100) {
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return totalLength * (1 - progress);
}

/**
 * Movimento contínuo sutil de flutuação (Float)
 */
export function floatLoop(frame: number, speed = 40, amplitude = 10) {
  return Math.sin(frame / speed) * amplitude;
}

/**
 * Flutuação 2D suave (eixos X e Y descentralizados) para objetos em cena
 */
export function float2D(frame: number, speedX = 45, speedY = 35, ampX = 6, ampY = 9) {
  return {
    x: Math.cos(frame / speedX) * ampX,
    y: Math.sin(frame / speedY) * ampY,
  };
}

/**
 * Pulso contínuo de escala (efeito respiração)
 */
export function pulseLoop(frame: number, speed = 25, scaleDelta = 0.05) {
  return 1 + Math.sin(frame / speed) * scaleDelta;
}

/**
 * Variação contínua de rotação sutil para cartões ou objetos flutuantes
 */
export function tiltLoop(frame: number, speed = 50, maxDeg = 1.8) {
  return Math.sin(frame / speed) * maxDeg;
}

/**
 * Pulso de brilho suave (Shimmer de opacidade)
 */
export function shimmerGlow(frame: number, speed = 30, minOp = 0.35, maxOp = 0.85) {
  const norm = (Math.sin(frame / speed) + 1) / 2;
  return minOp + norm * (maxOp - minOp);
}

