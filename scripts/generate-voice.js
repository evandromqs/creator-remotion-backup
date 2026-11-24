import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "yl2ZDV1MzN4HbQJbMihG";
// Modelo ElevenLabs v4 como padrão
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_v4";

if (!API_KEY) {
  console.error("ERRO: ELEVENLABS_API_KEY não encontrada no arquivo .env");
  process.exit(1);
}

const scriptPath = path.resolve(process.cwd(), "src/data/script.json");
const outputAudioPath = path.resolve(process.cwd(), "public/audio/narration.mp3");
const outputRootAudioPath = path.resolve(process.cwd(), "public/narracao.mp3");
const outputAlignmentPath = path.resolve(process.cwd(), "src/data/alignment.json");

async function generateVoice() {
  if (!fs.existsSync(scriptPath)) {
    console.error(`ERRO: Arquivo ${scriptPath} não encontrado.`);
    process.exit(1);
  }

  const scriptData = JSON.parse(fs.readFileSync(scriptPath, "utf-8"));
  const fullText = scriptData.fullText || scriptData.scenes.map((s) => s.text).join(" ");

  console.log("=== Gerando Narração com ElevenLabs (Timestamps) ===");
  console.log(`Modelo: ${MODEL_ID}`);
  console.log(`Voz ID: ${VOICE_ID}`);
  console.log(`Texto: "${fullText}"\n`);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`;

  const payload = {
    text: fullText,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha na API da ElevenLabs (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    const audioBuffer = Buffer.from(data.audio_base64, "base64");
    fs.mkdirSync(path.dirname(outputAudioPath), { recursive: true });
    fs.writeFileSync(outputAudioPath, audioBuffer);
    fs.writeFileSync(outputRootAudioPath, audioBuffer);
    console.log(`Áudio salvo em: ${outputAudioPath} e ${outputRootAudioPath}`);

    const alignment = data.alignment;
    fs.mkdirSync(path.dirname(outputAlignmentPath), { recursive: true });
    fs.writeFileSync(outputAlignmentPath, JSON.stringify(alignment, null, 2));
    console.log(`Alinhamento salvo em: ${outputAlignmentPath}`);

    const totalDurationSec = alignment.character_end_times_seconds[alignment.character_end_times_seconds.length - 1] || 0;
    console.log(`Duração: ${totalDurationSec.toFixed(2)}s (${Math.ceil(totalDurationSec * 30)} frames)`);

  } catch (error) {
    console.error("Erro ao gerar voz:", error.message);
    process.exit(1);
  }
}

generateVoice();
