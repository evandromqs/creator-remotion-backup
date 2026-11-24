import fs from "fs";
import path from "path";

const ALLOWED_HEX = ["#05070A", "#FFFFFF", "#1E6BFF", "#FF1F3D", "#000000"];

// Cenas históricas da Era 1941 onde o foco é P&B + Vermelho de alerta/guerra
const STRICT_VINTAGE_SCENES = [
  "S02_Origem1941.tsx",
  "S03_HedyLamarr.tsx",
  "S04_SinalBloqueado.tsx",
  "S06_PatenteSecreta.tsx",
];

function getAllFiles(dir, exts = [".ts", ".tsx"]) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllFiles("./src");
let hasErrors = false;

console.log("=== Auditoria Aprofundada de Paleta (4 Cores & Eras Históricas) ===");

const hexRegex = /#([0-9A-Fa-f]{3,8})\b/g;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const fileName = path.basename(file);
  const isVintage = STRICT_VINTAGE_SCENES.includes(fileName);

  // 1. Verificação de Hexadecimal
  let match;
  while ((match = hexRegex.exec(content)) !== null) {
    const hex = match[0].toUpperCase();
    if (!ALLOWED_HEX.includes(hex)) {
      console.error(`[Linter 4-Cores] ERRO em ${file}: Cor proibida '${hex}' encontrada!`);
      hasErrors = true;
    }
  }

  // 2. Verificação Contextual de Era Histórica (1941: P&B + Vermelho)
  if (isVintage) {
    if (content.includes("colors.BLUE") || content.includes("#1E6BFF")) {
      console.error(`[Linter Era-1941] ERRO em ${fileName}: Uso indevido de AZUL em cena estritamente P&B/Vermelho!`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error("❌ Falha no linter: existem violações de cores!");
  process.exit(1);
} else {
  console.log("✅ Sucesso: 100% do código obedece aos tokens BLACK, WHITE, BLUE, RED.");
}
