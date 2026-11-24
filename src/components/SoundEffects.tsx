import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { beats, sceneRange } from "../lib/timing";

export const SoundEffects: React.FC = () => {
  const r1 = sceneRange(1);

  return (
    <>
      {/* 1. Whoosh + Glitch Digital no Hook */}
      <Sequence from={r1.from} durationInFrames={15} layout="none">
        <Audio src={staticFile("audio/sfx/whoosh_fast.wav")} volume={0.38} />
      </Sequence>
      {beats.hookEinstein > 0 && (
        <Sequence from={beats.hookEinstein} durationInFrames={12} layout="none">
          <Audio src={staticFile("audio/sfx/glitch_digital.wav")} volume={0.45} />
        </Sequence>
      )}

      {/* 2. Alerta 11 KM */}
      {beats.desvio11km > 0 && (
        <Sequence from={beats.desvio11km} durationInFrames={15} layout="none">
          <Audio src={staticFile("audio/sfx/system_crash.wav")} volume={0.45} />
        </Sequence>
      )}

      {/* 3. Sputnik 1957 */}
      {beats.sputnik > 0 && (
        <Sequence from={beats.sputnik} durationInFrames={15} layout="none">
          <Audio src={staticFile("audio/sfx/scanner_beep.wav")} volume={0.4} />
        </Sequence>
      )}

      {/* 4. Doppler */}
      {beats.doppler > 0 && (
        <Sequence from={beats.doppler} durationInFrames={18} layout="none">
          <Audio src={staticFile("audio/sfx/spark_zap.wav")} volume={0.45} />
        </Sequence>
      )}

      {/* 5. Tempo Enlouqueceu */}
      {beats.enlouqueceu > 0 && (
        <Sequence from={beats.enlouqueceu} durationInFrames={18} layout="none">
          <Audio src={staticFile("audio/sfx/system_crash.wav")} volume={0.5} />
        </Sequence>
      )}

      {/* 6. Carro no Rio */}
      {beats.rio > 0 && (
        <Sequence from={beats.rio} durationInFrames={15} layout="none">
          <Audio src={staticFile("audio/sfx/spark_zap.wav")} volume={0.45} />
        </Sequence>
      )}

      {/* 7. Reprogramar */}
      {beats.reprogramar > 0 && (
        <Sequence from={beats.reprogramar} durationInFrames={15} layout="none">
          <Audio src={staticFile("audio/sfx/ui_success.wav")} volume={0.48} />
        </Sequence>
      )}

      {/* 8. Pop de Engajamento CTA */}
      {beats.delivery > 0 && (
        <Sequence from={beats.delivery} durationInFrames={12} layout="none">
          <Audio src={staticFile("audio/sfx/pop_cta.wav")} volume={0.42} />
        </Sequence>
      )}
    </>
  );
};
