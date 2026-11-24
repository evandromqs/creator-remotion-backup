import fs from "fs";
import path from "path";

const scenesDir = path.resolve(process.cwd(), "src/scenes");
if (!fs.existsSync(scenesDir)) {
  fs.mkdirSync(scenesDir, { recursive: true });
}

// 34 scenes conforming strictly to Blueprint v2.0
// Rules:
// - Width: 780px (between 680 and 860)
// - Poppins typography with sizes >= 42px (heroSize: 110, titleSize: 68, labelSize: 44)
// - Zero redundant subtitles (no sentences; only numbers, dates, or short 1-2 word labels)
// - Vibrant theme accents
// - Fade out last 6 frames

const scenesData = [
  // Scene 01: Giant ? question mark
  {
    num: "01",
    renderBody: `
  const qScale = spring({ frame, fps, config: theme.springs.bouncy });
  const pulse = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 3);
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>
        <div style={{ transform: \`scale(\${qScale * pulse})\`, filter: "drop-shadow(0 0 35px rgba(0, 240, 255, 0.6))" }}>
          <svg width="340" height="340" viewBox="0 0 340 340">
            <circle cx="170" cy="170" r="150" fill="none" stroke={theme.colors.cyan} strokeWidth="5" strokeDasharray="18 18" opacity="0.6" />
            <circle cx="170" cy="170" r="115" fill="rgba(0, 240, 255, 0.08)" />
            <text x="170" y="235" textAnchor="middle" fontSize={theme.typography.heroSize} fontWeight="900" fill={theme.colors.cyan} fontFamily={theme.typography.fontFamily}>?</text>
          </svg>
        </div>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: theme.colors.textPrimary, textTransform: "uppercase" }}>
          ORIGEM
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 02: Flash + giant BUG stencil text
  {
    num: "02",
    renderBody: `
  const flash = interpolate(frame, [0, 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = spring({ frame, fps, config: theme.springs.punchy });
  const jitter = frame % 4 === 0 ? (frame % 8 === 0 ? 6 : -6) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: flash }} />}
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.crimsonNeon}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 50px rgba(255, 46, 84, 0.3)" }}>
        <div style={{ transform: \`scale(\${scale}) translate(\${jitter}px, 0)\`, textAlign: "center" }}>
          <div style={{ fontSize: theme.typography.heroSize, fontWeight: 900, letterSpacing: 8, color: theme.colors.crimsonNeon, lineHeight: 1, textShadow: theme.colors.glowRed }}>
            "BUG"
          </div>
          <div style={{ marginTop: 36, padding: "12px 40px", background: theme.colors.crimsonNeon, color: "#FFFFFF", fontSize: theme.typography.labelSize, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", borderRadius: 16 }}>
            FALHA
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 03: Retro CRT monitor frame
  {
    num: "03",
    renderBody: `
  const crtScale = spring({ frame, fps, config: theme.springs.bouncy });
  const wave = (frame * 6) % 120;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${crtScale})\` }}>
          <svg width="560" height="380" viewBox="0 0 560 380">
            <rect x="20" y="20" width="520" height="340" rx="32" fill="#06080C" stroke={theme.colors.cyan} strokeWidth="4" />
            <rect x="45" y="45" width="470" height="290" rx="16" fill="#000000" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <line x1="45" y1={45 + wave} x2="515" y2={45 + wave} stroke={theme.colors.cyan} strokeWidth="3" opacity="0.4" />
            <line x1="45" y1={180 + wave} x2="515" y2={180 + wave} stroke={theme.colors.cyan} strokeWidth="2" opacity="0.25" />
            <text x="280" y="210" textAnchor="middle" fontSize={theme.typography.titleSize} fontWeight="700" fill="#FFFFFF" letterSpacing={6} fontFamily={theme.typography.fontFamily}>
              OFFLINE
            </text>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 04: Mainframe isometric server rack
  {
    num: "04",
    renderBody: `
  const rackScale = spring({ frame, fps, config: theme.springs.punchy });
  const busPulse = (frame * 4) % 50;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${rackScale})\` }}>
          <svg width="540" height="420" viewBox="0 0 540 420">
            <rect x="70" y="30" width="400" height="360" rx="16" fill="#0A0D14" stroke={theme.colors.cyan} strokeWidth="3" />
            {[0, 1, 2, 3].map((r) => (
              <g key={r}>
                <rect x="95" y={55 + r * 80} width="350" height="62" rx="8" fill="#040608" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <circle cx="130" cy={86 + r * 80} r="8" fill={theme.colors.cyan} opacity={r % 2 === 0 ? 0.95 : 0.4} />
                <circle cx="160" cy={86 + r * 80} r="8" fill={theme.colors.warmGold} opacity={r % 3 === 0 ? 0.95 : 0.3} />
                <line x1="190" y1={86 + r * 80} x2="415" y2={86 + r * 80} stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="8 8" strokeDashoffset={-busPulse} opacity="0.6" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 05: Giant Year 1947 rolling odometer
  {
    num: "05",
    renderBody: `
  const yearProgress = interpolate(frame, [0, Math.min(durationInFrames - 8, 45)], [1900, 1947], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearVal = Math.round(yearProgress);
  const scale = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.warmGold}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 50px rgba(255, 184, 0, 0.3)" }}>
        <div style={{ transform: \`scale(\${scale})\`, textAlign: "center" }}>
          <div style={{ fontSize: theme.typography.heroSize, fontWeight: 900, letterSpacing: 6, color: theme.colors.warmGold, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {yearVal}
          </div>
          <div style={{ marginTop: 28, fontSize: theme.typography.labelSize, fontWeight: 500, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
            MARCO HISTÓRICO
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 06: Harvard crest line art
  {
    num: "06",
    renderBody: `
  const scale = spring({ frame, fps, config: theme.springs.punchy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${scale})\`, textAlign: "center" }}>
          <svg width="280" height="300" viewBox="0 0 280 300">
            <path d="M30,40 L250,40 L250,170 Q250,270 140,290 Q30,270 30,170 Z" fill="#0A0A0A" stroke={theme.colors.crimsonNeon} strokeWidth="4" />
            <text x="140" y="125" textAnchor="middle" fontSize={theme.typography.labelSize} fontWeight="700" fill="#FFFFFF" letterSpacing={3} fontFamily={theme.typography.fontFamily}>HARVARD</text>
            <text x="140" y="185" textAnchor="middle" fontSize={theme.typography.labelSize} fontWeight="500" fill={theme.colors.crimsonNeon} letterSpacing={2} fontFamily={theme.typography.fontFamily}>VERITAS</text>
          </svg>
          <div style={{ marginTop: 32, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
            HARVARD
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 07: Perspective 3D room wireframe grid
  {
    num: "07",
    renderBody: `
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${zoom})\` }}>
          <svg width="600" height="420" viewBox="0 0 600 420">
            <rect x="40" y="30" width="520" height="360" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" />
            <line x1="40" y1="30" x2="220" y2="160" stroke={theme.colors.cyan} strokeWidth="2.5" opacity="0.7" />
            <line x1="560" y1="30" x2="380" y2="160" stroke={theme.colors.cyan} strokeWidth="2.5" opacity="0.7" />
            <line x1="40" y1="390" x2="220" y2="260" stroke={theme.colors.cyan} strokeWidth="2.5" opacity="0.7" />
            <line x1="560" y1="390" x2="380" y2="260" stroke={theme.colors.cyan} strokeWidth="2.5" opacity="0.7" />
            <rect x="220" y="160" width="160" height="100" fill="#0A0D14" stroke="#FFFFFF" strokeWidth="3" />
            <text x="300" y="225" textAnchor="middle" fontSize={theme.typography.labelSize} fontWeight="700" fill="#FFFFFF" letterSpacing={3} fontFamily={theme.typography.fontFamily}>MARK II</text>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 08: Weight gauge "5 TONELADAS"
  {
    num: "08",
    renderBody: `
  const scale = spring({ frame, fps, config: theme.springs.bouncy });
  const gaugeFill = interpolate(frame, [0, 30], [0, 240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${scale})\`, textAlign: "center" }}>
          <svg width="400" height="240" viewBox="0 0 400 240">
            <path d="M40,200 A160,160 0 0,1 360,200" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="18" strokeLinecap="round" />
            <path d="M40,200 A160,160 0 0,1 360,200" fill="none" stroke={theme.colors.cyan} strokeWidth="18" strokeLinecap="round" strokeDasharray="502" strokeDashoffset={502 - (gaugeFill / 240) * 502} />
            <text x="200" y="175" textAnchor="middle" fontSize={theme.typography.heroSize} fontWeight="900" fill="#FFFFFF" fontFamily={theme.typography.fontFamily}>5T</text>
          </svg>
          <div style={{ fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: theme.colors.cyan, textTransform: "uppercase", marginTop: 12 }}>
            PESO TOTAL
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 09: Matrix of relay dots
  {
    num: "09",
    renderBody: `
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="600" height="420" viewBox="0 0 600 420">
          <rect x="30" y="20" width="540" height="380" rx="20" fill="#080A0E" stroke={theme.colors.cyan} strokeWidth="3" />
          {Array.from({ length: 24 }, (_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            const cx = 85 + col * 86;
            const cy = 70 + row * 82;
            const active = Math.sin((frame * 0.45) + i * 1.5) > 0.15;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="22" fill={active ? theme.colors.cyan : "none"} stroke="#FFFFFF" strokeWidth="3" opacity={active ? 1 : 0.25} />
                {active && <circle cx={cx} cy={cy} r="9" fill="#000000" />}
              </g>
            );
          })}
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.labelSize, fontWeight: 500, letterSpacing: 3, color: "#FFFFFF", textTransform: "uppercase" }}>
          RELÉS ATIVOS
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 10: Frequency soundwave bars
  {
    num: "10",
    renderBody: `
  const bars = Array.from({ length: 16 }, (_, i) => {
    return 30 + 130 * Math.abs(Math.sin((frame * 0.35) + i * 0.7));
  });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 260 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ width: 22, height: h, background: theme.colors.cyan, borderRadius: 12, boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)" }} />
          ))}
        </div>
        <div style={{ marginTop: 40, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          RUÍDO ACÚSTICO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 11: Date badge "09 SET 1947" stamp impact
  {
    num: "11",
    renderBody: `
  const stamp = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${stamp})\`, textAlign: "center", border: \`4px solid \${theme.colors.warmGold}\`, padding: "36px 60px", borderRadius: 24, background: "rgba(255, 184, 0, 0.08)", boxShadow: "0 0 50px rgba(255, 184, 0, 0.3)" }}>
          <div style={{ fontSize: theme.typography.heroSize, fontWeight: 900, letterSpacing: 4, color: theme.colors.warmGold, lineHeight: 1 }}>
            09 SET
          </div>
          <div style={{ fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 6, color: "#FFFFFF", marginTop: 16 }}>
            1947
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 12: System Crash Alert
  {
    num: "12",
    renderBody: `
  const flash = frame % 6 < 3 ? 1 : 0.3;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 46, 84, 0.05)", border: \`2px solid \${theme.colors.crimsonNeon}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(255, 46, 84, 0.4)" }}>
        <div style={{ padding: "16px 44px", background: theme.colors.crimsonNeon, color: "#FFFFFF", fontSize: theme.typography.labelSize, fontWeight: 700, letterSpacing: 4, borderRadius: 40, marginBottom: 36, opacity: flash }}>
          ALERTA GERAL
        </div>
        <div style={{ fontSize: theme.typography.heroSize, fontWeight: 900, letterSpacing: 6, color: theme.colors.crimsonNeon, lineHeight: 1 }}>
          TRAVOU!
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 13: Broken calculation graph
  {
    num: "13",
    renderBody: `
  const drop = interpolate(frame, [0, 20], [100, 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="600" height="380" viewBox="0 0 600 380">
          <rect x="30" y="30" width="540" height="320" fill="#080A0E" stroke="rgba(255,255,255,0.15)" strokeWidth="2" rx="16" />
          <line x1="60" y1="310" x2="540" y2="310" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" />
          <path d={\`M60,140 L180,110 L300,130 L400,\${drop} L520,\${drop}\`} fill="none" stroke={theme.colors.crimsonNeon} strokeWidth="6" strokeLinecap="round" />
          <circle cx="400" cy={drop} r="12" fill={theme.colors.crimsonNeon} />
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: theme.colors.crimsonNeon, textTransform: "uppercase" }}>
          ERRO ZERO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 14: Dense circuit wiring
  {
    num: "14",
    renderBody: `
  const wireOffset = (frame * 5) % 80;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="620" height="360" viewBox="0 0 620 360">
          {[0, 1, 2, 3, 4].map((w) => (
            <path key={w} d={\`M40,\${50 + w * 60} H240 V\${120 + w * 30} H420 V\${50 + w * 60} H580\`} fill="none" stroke={theme.colors.cyan} strokeWidth="4" strokeDasharray="16 16" strokeDashoffset={-wireOffset + w * 15} opacity={0.4 + w * 0.14} />
          ))}
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          CIRCUITO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 15: Grace Hopper badge
  {
    num: "15",
    renderBody: `
  const scale = spring({ frame, fps, config: theme.springs.punchy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${scale})\`, textAlign: "center" }}>
          <div style={{ width: 220, height: 220, borderRadius: "50%", border: \`4px solid \${theme.colors.cyan}\`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 240, 255, 0.08)", boxShadow: "0 0 50px rgba(0, 240, 255, 0.4)" }}>
            <svg width="110" height="110" viewBox="0 0 70 70">
              <polygon points="35,5 44,24 65,27 49,42 53,63 35,53 17,63 21,42 5,27 26,24" fill={theme.colors.cyan} />
            </svg>
          </div>
          <div style={{ marginTop: 32, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
            GRACE HOPPER
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 16: Door panels opening
  {
    num: "16",
    renderBody: `
  const openOffset = interpolate(frame, [0, 25], [0, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="600" height="380" viewBox="0 0 600 380">
          <rect x="180" y="40" width="240" height="300" fill="#0A0D14" stroke={theme.colors.cyan} strokeWidth="2.5" />
          <circle cx="300" cy="190" r="42" fill={theme.colors.cyan} opacity="0.35" />
          <rect x={100 - openOffset} y="30" width="200" height="320" rx="6" fill="#141822" stroke="#FFFFFF" strokeWidth="3" />
          <rect x={300 + openOffset} y="30" width="200" height="320" rx="6" fill="#141822" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          PAINÉIS
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 17: Radar sweep scanning relay
  {
    num: "17",
    renderBody: `
  const angle = (frame * 7) % 360;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="380" height="380" viewBox="0 0 380 380">
          <circle cx="190" cy="190" r="160" fill="none" stroke={theme.colors.cyan} strokeWidth="3" opacity="0.4" />
          <circle cx="190" cy="190" r="110" fill="none" stroke={theme.colors.cyan} strokeWidth="1.5" opacity="0.25" />
          <line x1="190" y1="190" x2={190 + 160 * Math.cos((angle * Math.PI) / 180)} y2={190 + 160 * Math.sin((angle * Math.PI) / 180)} stroke={theme.colors.cyan} strokeWidth="4" />
          <circle cx="190" cy="190" r="8" fill={theme.colors.cyan} />
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          VARREDURA
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 18: Target lock Panel F Relay #70
  {
    num: "18",
    renderBody: `
  const lockScale = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.warmGold}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(255, 184, 0, 0.3)" }}>
        <div style={{ transform: \`scale(\${lockScale})\`, textAlign: "center" }}>
          <div style={{ fontSize: theme.typography.heroSize, fontWeight: 900, letterSpacing: 6, color: theme.colors.warmGold, lineHeight: 1 }}>
            RELÉ #70
          </div>
          <div style={{ marginTop: 28, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 6, color: "#FFFFFF" }}>
            PAINEL F
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 19: Macro zoom on contacts
  {
    num: "19",
    renderBody: `
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${zoom})\` }}>
          <svg width="580" height="340" viewBox="0 0 580 340">
            <rect x="110" y="40" width="360" height="80" rx="10" fill="#141822" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="250" y="120" width="80" height="30" fill={theme.colors.warmGold} />
            <line x1="230" y1="170" x2="350" y2="170" stroke={theme.colors.warmGold} strokeWidth="3" strokeDasharray="6 6" opacity="0.6" />
            <rect x="250" y="190" width="80" height="30" fill={theme.colors.warmGold} />
            <rect x="110" y="220" width="360" height="80" rx="10" fill="#141822" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        </div>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          CONTATOS
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 20: Animated moth SVG
  {
    num: "20",
    renderBody: `
  const flap = 28 * Math.sin((frame / fps) * Math.PI * 6);
  const mothScale = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.warmGold}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(255, 184, 0, 0.4)" }}>
        <div style={{ transform: \`scale(\${mothScale})\` }}>
          <svg width="480" height="320" viewBox="0 0 480 320">
            <g transform="translate(240, 160)">
              <path d={\`M0,0 C-\${80 + flap},-70 -160,-40 -110,20 C-80,50 -30,30 0,0\`} fill={theme.colors.warmGold} opacity="0.9" />
              <path d={\`M0,0 C\${80 + flap},-70 160,-40 110,20 C80,50 30,30 0,0\`} fill={theme.colors.warmGold} opacity="0.9" />
              <ellipse cx="0" cy="8" rx="10" ry="34" fill="#FFFFFF" />
              <circle cx="0" cy="-30" r="10" fill="#FFFFFF" />
              <line x1="0" y1="-36" x2="-26" y2="-65" stroke={theme.colors.warmGold} strokeWidth="3" />
              <line x1="0" y1="-36" x2="26" y2="-65" stroke={theme.colors.warmGold} strokeWidth="3" />
            </g>
          </svg>
        </div>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: theme.colors.warmGold, textTransform: "uppercase" }}>
          MARIPOSA REAL
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 21: Thermal radiation
  {
    num: "21",
    renderBody: `
  const rings = [0, 1, 2, 3].map((i) => {
    const r = (frame * 4 + i * 45) % 180;
    const op = 1 - r / 180;
    return { r, op };
  });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="380" height="380" viewBox="0 0 380 380">
          {rings.map((rg, idx) => (
            <circle key={idx} cx="190" cy="190" r={rg.r} fill="none" stroke={theme.colors.amberAlert} strokeWidth="3.5" opacity={rg.op * 0.75} />
          ))}
          <circle cx="190" cy="190" r="26" fill={theme.colors.amberAlert} />
        </svg>
        <div style={{ marginTop: 28, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: theme.colors.amberAlert, textTransform: "uppercase" }}>
          CALOR
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 22: Blocked current
  {
    num: "22",
    renderBody: `
  const strobe = frame % 4 < 2 ? 1 : 0.4;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.crimsonNeon}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="580" height="240" viewBox="0 0 580 240">
          <line x1="50" y1="120" x2="230" y2="120" stroke={theme.colors.cyan} strokeWidth="6" strokeLinecap="round" />
          <circle cx="290" cy="120" r="44" fill="#0A0A0A" stroke={theme.colors.crimsonNeon} strokeWidth="4" />
          <line x1="265" y1="95" x2="315" y2="145" stroke={theme.colors.crimsonNeon} strokeWidth="5" opacity={strobe} />
          <line x1="315" y1="95" x2="265" y2="145" stroke={theme.colors.crimsonNeon} strokeWidth="5" opacity={strobe} />
          <line x1="350" y1="120" x2="530" y2="120" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeDasharray="14 14" opacity="0.3" />
        </svg>
        <div style={{ marginTop: 28, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: theme.colors.crimsonNeon, textTransform: "uppercase" }}>
          BLOQUEIO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 23: Tweezers tool
  {
    num: "23",
    renderBody: `
  const tY = interpolate(frame, [0, 20], [-80, 25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="420" height="320" viewBox="0 0 420 320">
          <g transform={\`translate(0, \${tY})\`}>
            <path d="M150,30 L195,190 L205,230" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            <path d="M270,30 L225,190 L215,230" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            <circle cx="210" cy="245" r="12" fill={theme.colors.warmGold} />
          </g>
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          PINÇA
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 24: Adhesive tape
  {
    num: "24",
    renderBody: `
  const tape = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${tape})\` }}>
          <svg width="540" height="340" viewBox="0 0 540 340">
            <rect x="60" y="30" width="420" height="280" rx="12" fill="#FFFFFF" />
            {[0, 1, 2, 3].map((l) => (
              <line key={l} x1="100" y1={70 + l * 44} x2="440" y2={70 + l * 44} stroke="#A0AEC0" strokeWidth="2" opacity="0.6" />
            ))}
            <rect x="180" y="110" width="180" height="70" rx="6" fill="rgba(0,0,0,0.2)" stroke="#000000" strokeWidth="2.5" strokeDasharray="6 6" />
            <ellipse cx="270" cy="145" rx="20" ry="12" fill="#000000" />
          </svg>
        </div>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          REGISTRO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 25: Logbook entry
  {
    num: "25",
    renderBody: `
  const draw = interpolate(frame, [0, 30], [380, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="600" height="320" viewBox="0 0 600 320">
          <rect x="30" y="30" width="540" height="260" rx="16" fill="#0A0D14" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M70,110 Q190,95 310,115 T530,110" fill="none" stroke={theme.colors.cyan} strokeWidth="4" strokeDasharray="380" strokeDashoffset={draw} />
          <path d="M70,180 Q190,165 310,185 T450,180" fill="none" stroke={theme.colors.cyan} strokeWidth="4" strokeDasharray="380" strokeDashoffset={draw} />
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          DIÁRIO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 26: Stamp "FIRST BUG"
  {
    num: "26",
    renderBody: `
  const stamp = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${stamp}) rotate(-4deg)\`, border: \`6px solid \${theme.colors.crimsonNeon}\`, padding: "36px 60px", borderRadius: 16, background: "rgba(255, 46, 84, 0.08)", boxShadow: "0 0 50px rgba(255, 46, 84, 0.4)", textAlign: "center" }}>
          <div style={{ fontSize: theme.typography.titleSize, fontWeight: 900, letterSpacing: 4, color: theme.colors.crimsonNeon, lineHeight: 1 }}>
            FIRST BUG
          </div>
          <div style={{ fontSize: theme.typography.labelSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", marginTop: 14 }}>
            FOUND
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 27: Binary stream
  {
    num: "27",
    renderBody: `
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: theme.typography.labelSize, letterSpacing: 8, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 2 }}>
          <div>01100010 01110101</div>
          <div style={{ color: theme.colors.emeraldNeon, fontWeight: 700, fontSize: theme.typography.titleSize }}>DEBUG</div>
          <div>01000110 01001001</div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 28: Terminal window
  {
    num: "28",
    renderBody: `
  const cursor = frame % 12 < 6 ? 1 : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 620, background: "#06080C", borderRadius: 16, border: \`2px solid \${theme.colors.cyan}\`, padding: "28px 36px", boxShadow: "0 0 40px rgba(0, 240, 255, 0.25)" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: theme.colors.crimsonNeon }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: theme.colors.warmGold }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: theme.colors.emeraldNeon }} />
          </div>
          <div style={{ fontFamily: "monospace", fontSize: theme.typography.labelSize, color: "#FFFFFF", lineHeight: 1.8 }}>
            <div>$ check()</div>
            <div style={{ color: theme.colors.cyan }}>&gt; isolated</div>
            <div>$ fix()<span style={{ opacity: cursor }}>_</span></div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 29: Kinetic typography "DEBUGGING"
  {
    num: "29",
    renderBody: `
  const scale = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.emeraldNeon}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 50px rgba(0, 230, 118, 0.3)" }}>
        <div style={{ transform: \`scale(\${scale})\`, textAlign: "center" }}>
          <div style={{ fontSize: theme.typography.heroSize, fontWeight: 900, letterSpacing: 8, color: theme.colors.emeraldNeon, lineHeight: 1 }}>
            DEBUG
          </div>
          <div style={{ width: 280, height: 6, background: theme.colors.emeraldNeon, margin: "28px auto 0", borderRadius: 3 }} />
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 30: Bug crossed out -> Checkmark
  {
    num: "30",
    renderBody: `
  const check = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${check})\` }}>
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="115" fill={theme.colors.emeraldNeon} />
            <polyline points="75,135 115,175 190,95" fill="none" stroke="#000000" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ marginTop: 28, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: theme.colors.emeraldNeon, textTransform: "uppercase" }}>
          RESOLVIDO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 31: Timeline 1947 -> HOJE
  {
    num: "31",
    renderBody: `
  const fill = interpolate(frame, [0, durationInFrames], [0, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="560" height="160" viewBox="0 0 560 160">
          <rect x="40" y="70" width="480" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
          <rect x="40" y="70" width={fill} height="12" rx="6" fill={theme.colors.cyan} />
          <circle cx="40" cy="76" r="16" fill={theme.colors.cyan} />
          <text x="40" y="125" textAnchor="middle" fontSize={theme.typography.labelSize} fontWeight="700" fill="#FFFFFF" fontFamily={theme.typography.fontFamily}>1947</text>
          <circle cx="520" cy="76" r="16" fill={theme.colors.cyan} />
          <text x="520" y="125" textAnchor="middle" fontSize={theme.typography.labelSize} fontWeight="700" fill="#FFFFFF" fontFamily={theme.typography.fontFamily}>HOJE</text>
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          EVOLUÇÃO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 32: Microprocessor CPU die
  {
    num: "32",
    renderBody: `
  const cpuScale = spring({ frame, fps, config: theme.springs.punchy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: \`scale(\${cpuScale})\` }}>
          <svg width="340" height="340" viewBox="0 0 340 340">
            <rect x="70" y="70" width="200" height="200" rx="24" fill="#0A0D14" stroke={theme.colors.cyan} strokeWidth="4" />
            <rect x="110" y="110" width="120" height="120" rx="12" fill={theme.colors.cyan} />
            {[0, 1, 2, 3].map((p) => (
              <g key={p}>
                <line x1={100 + p * 45} y1="30" x2={100 + p * 45} y2="70" stroke="#FFFFFF" strokeWidth="3" />
                <line x1={100 + p * 45} y1="270" x2={100 + p * 45} y2="310" stroke="#FFFFFF" strokeWidth="3" />
                <line x1="30" y1={100 + p * 45} x2="70" y2={100 + p * 45} stroke="#FFFFFF" strokeWidth="3" />
                <line x1="270" y1={100 + p * 45} x2="310" y2={100 + p * 45} stroke="#FFFFFF" strokeWidth="3" />
              </g>
            ))}
          </svg>
        </div>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          SILÍCIO
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 33: Cyber radar scan
  {
    num: "33",
    renderBody: `
  const sweep = (frame * 8) % 360;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.surfaceBorder}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <svg width="360" height="360" viewBox="0 0 360 360">
          <circle cx="180" cy="180" r="150" fill="none" stroke={theme.colors.cyan} strokeWidth="3" opacity="0.35" />
          <line x1="180" y1="180" x2={180 + 150 * Math.cos((sweep * Math.PI) / 180)} y2={180 + 150 * Math.sin((sweep * Math.PI) / 180)} stroke={theme.colors.cyan} strokeWidth="4" />
          <circle cx="180" cy="180" r="8" fill={theme.colors.cyan} />
        </svg>
        <div style={{ marginTop: 24, fontSize: theme.typography.titleSize, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
          MONITOR
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },

  // Scene 34: Final Viral CTA
  {
    num: "34",
    renderBody: `
  const pulse = 1 + 0.05 * Math.sin((frame / fps) * Math.PI * 3);
  const ctaScale = spring({ frame, fps, config: theme.springs.bouncy });
  return (
    <AbsoluteFill style={{ opacity: fadeOut, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 780, height: 780, borderRadius: 36, background: "rgba(255, 255, 255, 0.03)", border: \`2px solid \${theme.colors.emeraldNeon}\`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(0, 230, 118, 0.4)" }}>
        <div style={{ transform: \`scale(\${ctaScale * pulse})\`, textAlign: "center" }}>
          <div style={{ background: theme.colors.emeraldNeon, color: "#000000", padding: "28px 60px", borderRadius: 48, fontSize: theme.typography.labelSize, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", boxShadow: "0 0 50px rgba(0, 230, 118, 0.8)" }}>
            SEGUE AÍ 🚀
          </div>
          <div style={{ marginTop: 32, fontSize: theme.typography.titleSize, fontWeight: 900, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase" }}>
            TECH VIBES
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );`,
  },
];

for (const s of scenesData) {
  const code = `import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../theme";

export const Scene${s.num}: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
${s.renderBody}
};
`;

  fs.writeFileSync(path.join(scenesDir, `Scene${s.num}.tsx`), code);
}

// Generate index.ts
const imports = scenesData.map((s) => "import { Scene" + s.num + " } from \"./Scene" + s.num + "\";").join("\n");
const array = "export const scenes = [\n  " + scenesData.map((s) => "Scene" + s.num).join(",\n  ") + "\n];\n";

fs.writeFileSync(path.join(scenesDir, "index.ts"), imports + "\n\n" + array);
console.log("Built all 34 scenes with Blueprint v2.0 standards!");
