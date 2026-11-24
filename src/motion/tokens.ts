export const MOTION_PALETTE = {
  // Cores do Modern Explainer Design System
  dominantBlue: "#2457D6",    // Azul moderno primário
  accentAmber: "#FFB84D",     // Âmbar para destaque / dados / Einstein
  secondaryCoral: "#F16D5B",  // Coral para alertas / desvios / erros
  secondaryGreen: "#63B98B",  // Verde para conexões certas / satélites ok
  cyanSignal: "#38BDF8",      // Ciano brilhante para ondas de sinal GPS e feixes
  
  // Fundos & Superfícies (Modern Explainer Dark Space)
  bgDeep: "#090D1A",          // Fundo principal profundo
  bgCard: "#131B2E",          // Fundo de cards e caixas informativas
  bgCardBorder: "rgba(56, 189, 248, 0.2)",
  
  // Tipografia & Contrastes
  textWhite: "#F8FAFC",
  textMuted: "#94A3B8",
  textDim: "#64748B",
} as const;

export const MOTION_SHADOWS = {
  card: "0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.08)",
  glowCyan: "0 0 20px rgba(56, 189, 248, 0.45)",
  glowAmber: "0 0 20px rgba(255, 184, 77, 0.45)",
  glowGreen: "0 0 20px rgba(99, 185, 139, 0.45)",
} as const;
