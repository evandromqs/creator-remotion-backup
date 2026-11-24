import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PunchIn } from "./PunchIn";
import { GlitchHit } from "./GlitchHit";
import { Shake } from "./Shake";
import { WordPop } from "./WordPop";
import { Stamp } from "./Stamp";
import { ParticleBurst } from "./ParticleBurst";
import { Typewriter } from "./Typewriter";
import { Counter } from "./Counter";
import { Flash } from "./Flash";
import { Blackout } from "./Blackout";
import { colors, FONT_UI } from "../design/tokens";

export const FXPreview: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BLACK,
        color: colors.WHITE,
        fontFamily: FONT_UI,
        padding: 80,
        display: "flex",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <h1 style={{ fontSize: 48, color: colors.BLUE }}>
        FX Library Preview (Frame: {frame})
      </h1>

      <PunchIn frame={frame} startFrame={10}>
        <div style={{ padding: 20, background: "rgba(30, 107, 255, 0.2)", border: `1px solid ${colors.BLUE}`, borderRadius: 12 }}>
          PunchIn Effect
        </div>
      </PunchIn>

      <GlitchHit frame={frame} startFrame={30} duration={12}>
        <div style={{ padding: 20, background: "rgba(255, 31, 61, 0.2)", border: `1px solid ${colors.RED}`, borderRadius: 12 }}>
          GlitchHit Effect
        </div>
      </GlitchHit>

      <Shake frame={frame} startFrame={50} duration={14}>
        <div style={{ padding: 20, background: "rgba(255, 255, 255, 0.1)", border: `1px solid ${colors.WHITE}`, borderRadius: 12 }}>
          Shake Effect
        </div>
      </Shake>

      <WordPop frame={frame} startFrame={70}>
        <span style={{ color: colors.BLUE, fontSize: 40, fontWeight: "bold" }}>DEBUG</span>
      </WordPop>

      <Stamp frame={frame} startFrame={90}>
        <div style={{ padding: 20, border: `4px solid ${colors.RED}`, color: colors.RED, fontWeight: "bold" }}>
          FIRST BUG
        </div>
      </Stamp>

      <ParticleBurst frame={frame} startFrame={110} color={colors.RED} />

      <Typewriter
        text="Harvard Mark II..."
        frame={frame}
        startFrame={130}
        speed={1.0}
      />

      <Counter
        frame={frame}
        startFrame={160}
        fromValue={0}
        toValue={70}
        durationFrames={30}
      />

      <Flash frame={frame} startFrame={200} duration={5} />
      <Blackout frame={frame} startFrame={220} duration={8} />
    </AbsoluteFill>
  );
};
