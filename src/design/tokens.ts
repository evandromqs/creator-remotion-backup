import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

// Carregamento de pesos Black / Bold ultra-pesados
export const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["700"],
  ignoreTooManyRequestsWarning: true,
});

export const jetbrainsMono = loadJetBrainsMono("normal", {
  weights: ["700", "800"],
  ignoreTooManyRequestsWarning: true,
});

export const FONT_UI = spaceGrotesk.fontFamily;
export const FONT_CODE = jetbrainsMono.fontFamily;

/**
 * PALETA OFICIAL MINIMALISTA DE ALTO CONTRASTE (4 CORES)
 */
export const colors = {
  BLACK: "#05070A", // Fundo preto puro absoluto
  WHITE: "#FFFFFF", // Tipografia brutalista branca
  BLUE: "#1E6BFF",  // Tecnologia, satélites, órbitas, vetores de sinal
  RED: "#FF1F3D",   // Alerta, desvio de rota, erro relativístico, impacto
};

export const safeZone = {
  top: 140,
  bottom: 400,
  left: 100,
  right: 100,
  width: 1080 - 100 * 2,
  height: 1920 - 140 - 400,
  captionsY: 1480,
};

export const springPresets = {
  snappy: { damping: 16, stiffness: 280, mass: 0.6 },
  punchy: { damping: 12, stiffness: 240, mass: 0.8 },
  smooth: { damping: 22, stiffness: 140, mass: 1 },
  bouncy: { damping: 10, stiffness: 190, mass: 0.9 },
};

export const shadows = {
  blueGlow: "0 0 40px rgba(30, 107, 255, 0.7)",
  redGlow: "0 0 50px rgba(255, 31, 61, 0.8)",
  whiteGlow: "0 0 30px rgba(255, 255, 255, 0.6)",
  blackHard: "0 10px 30px #05070A",
};
