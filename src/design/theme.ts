import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import scenesData from "../data/scenes.json";

export const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["700"],
  ignoreTooManyRequestsWarning: true,
});

export const montserrat = loadMontserrat("normal", {
  weights: ["900"],
  ignoreTooManyRequestsWarning: true,
});

export const theme = {
  palette: scenesData.style.palette,
  fonts: {
    headline: spaceGrotesk.fontFamily,
    caption: montserrat.fontFamily,
    numbers: `${spaceGrotesk.fontFamily}, monospace`,
  },
  look: scenesData.style.look,
  safeZones: {
    top: Math.round(scenesData.meta.height * scenesData.style.safeZones.top), // 192px
    bottom: Math.round(scenesData.meta.height * scenesData.style.safeZones.bottom), // 422px
    left: Math.round(scenesData.meta.width * scenesData.style.safeZones.left), // 65px
    right: Math.round(scenesData.meta.width * scenesData.style.safeZones.right), // 130px
    captionsY: scenesData.meta.height - Math.round(scenesData.meta.height * scenesData.style.safeZones.bottom) - 80,
  },
  captionsStyle: scenesData.captions,
};
