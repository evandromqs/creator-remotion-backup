export const MODERN_EXPLAINER_PALETTE = {
  dominant: '#2457D6',       // Azul
  accent: '#FFB84D',         // Âmbar
  secondaryCoral: '#F16D5B', // Coral
  secondaryGreen: '#63B98B', // Verde
  neutral: '#F3F4F6',        // Neutro
} as const;

export const COLOR_DISTRIBUTION_GUIDELINE = {
  neutral: 0.6,
  dominant: 0.25,
  secondary: 0.1,
  accent: 0.05,
} as const;

export type ModernExplainerColor = keyof typeof MODERN_EXPLAINER_PALETTE;
