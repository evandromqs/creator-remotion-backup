import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const preserveAudio =
  process.argv.includes("--keep-audio") ||
  process.argv.includes("--preserve-audio");

function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}${MM}${dd}-${HH}${mm}${ss}`;
}

function archivePreviousVideo() {
  const currentVideo = path.join(projectRoot, "out", "video.mp4");
  const archiveDir = path.join(projectRoot, "out", "archive");

  if (fs.existsSync(currentVideo)) {
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    const timestamp = formatTimestamp(new Date());
    const targetFile = path.join(archiveDir, `video-${timestamp}.mp4`);
    fs.copyFileSync(currentVideo, targetFile);
    fs.unlinkSync(currentVideo);
    console.log(
      `[Archive] Vídeo anterior arquivado em: out/archive/video-${timestamp}.mp4`
    );
  } else {
    console.log("[Archive] Nenhum video.mp4 encontrado para arquivar.");
  }
}

function cleanDirectoryFiles(dirPath, extensionPattern = null) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (item === ".gitkeep" || item === "archive") continue;
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      if (!extensionPattern || extensionPattern.test(item)) {
        fs.unlinkSync(fullPath);
        console.log(
          `[Clean] Removido arquivo: ${path.relative(projectRoot, fullPath)}`
        );
      }
    }
  }
}

function restoreInitialData() {
  const dataDir = path.join(projectRoot, "src", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Base mínima válida para script.json
  const defaultScript = {
    topic: "Template Base",
    scenes: [
      {
        id: "scene_01",
        title: "Cena Inicial",
        text: "Bem-vindo ao motor de produção automatizado de vídeo.",
        durationHintSec: 5,
      },
    ],
  };
  fs.writeFileSync(
    path.join(dataDir, "script.json"),
    JSON.stringify(defaultScript, null, 2)
  );

  // Base mínima válida para alignment.json
  const defaultAlignment = {
    characters: ["B", "e", "m", "-", "v", "i", "n", "d", "o"],
    character_start_times_seconds: [
      0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8,
    ],
    character_end_times_seconds: [
      0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0,
    ],
  };
  fs.writeFileSync(
    path.join(dataDir, "alignment.json"),
    JSON.stringify(defaultAlignment, null, 2)
  );

  // Base mínima válida para scene-timings.json (30 FPS, 150 frames = 5 segundos)
  const defaultTimings = [
    {
      id: "scene_01",
      title: "Cena Inicial",
      startSec: 0,
      endSec: 5,
      startFrame: 0,
      endFrame: 150,
      durationFrames: 150,
    },
  ];
  fs.writeFileSync(
    path.join(dataDir, "scene-timings.json"),
    JSON.stringify(defaultTimings, null, 2)
  );

  console.log(
    "[Restore] Dados base redefinidos com sucesso em src/data/ (script, alignment, scene-timings)."
  );
}

function restoreScenesStub() {
  const scenesDir = path.join(projectRoot, "src", "scenes");
  if (!fs.existsSync(scenesDir)) {
    fs.mkdirSync(scenesDir, { recursive: true });
  }

  const stubSceneCode = `import React from "react";
import { AbsoluteFill } from "remotion";

export const Scene01: React.FC<{ durationInFrames: number }> = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        fontWeight: 700,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      TEMPLATE LIMPO • PRONTO PARA PRODUÇÃO
    </AbsoluteFill>
  );
};
`;

  fs.writeFileSync(path.join(scenesDir, "Scene01.tsx"), stubSceneCode);
  fs.writeFileSync(
    path.join(scenesDir, "index.ts"),
    `import { Scene01 } from "./Scene01";\n\nexport const scenes = [Scene01];\n`
  );
  console.log(
    "[Restore] Stub base de cenas criado em src/scenes/Scene01.tsx e index.ts."
  );
}

function resetProject() {
  console.log("=== Iniciando Rotina de Arquivamento e Reset ===");
  if (preserveAudio) {
    console.log(
      "[Opção Ativa] Modo de preservação: ÁUDIO e TIMESTAMPS SERÃO MANTIDOS intactos!"
    );
  }

  archivePreviousVideo();

  // Limpeza de diretórios de produção
  cleanDirectoryFiles(path.join(projectRoot, "src", "scenes"), /\.tsx$/);
  cleanDirectoryFiles(path.join(projectRoot, "public", "assets"));

  if (!preserveAudio) {
    cleanDirectoryFiles(path.join(projectRoot, "public", "audio"));
  } else {
    console.log(
      "[Preserve] Pasta public/audio/ mantida intacta (áudio preservado)."
    );
  }

  cleanDirectoryFiles(path.join(projectRoot, "out"), /\.png$/);

  if (!preserveAudio) {
    restoreInitialData();
  } else {
    console.log(
      "[Preserve] Arquivos em src/data/ (alignment.json, scene-timings.json, script.json) mantidos intactos."
    );
  }

  restoreScenesStub();

  console.log(
    "=== Reset concluído com sucesso. Projeto pronto para uma nova produção! ==="
  );
}

resetProject();
