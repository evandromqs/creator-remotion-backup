import fs from "fs";
import path from "path";

let hasErrors = false;

console.log("=== Auditoria de Estabilidade Geométrica e Anti-Layout-Shift ===");

// 1. Auditar primitivos em src/fx/
const fxWrapperFiles = ["PunchIn.tsx", "Shake.tsx", "GlitchHit.tsx"];
for (const file of fxWrapperFiles) {
  const fullPath = path.join("./src/fx", file);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, "utf8");

  if (content.includes("return <>{children}</>")) {
    console.error(
      `[Regra FX-DOM] ERRO em src/fx/${file}: Retorno condicional '<>{children}</>' proibido! Causa mutação de DOM e pulo de layout quando o efeito ativa/desativa.`
    );
    hasErrors = true;
  }

  if (content.includes('width: "100%"') || content.includes('height: "100%"')) {
    console.error(
      `[Regra FX-Flex] ERRO em src/fx/${file}: Uso de width/height '100%' proibido em wrappers de efeito! Isso estica o container no Flexbox e joga filhos de largura fixa para a esquerda.`
    );
    hasErrors = true;
  }
}

// 2. Auditar cenas em src/scenes/
const scenesDir = "./src/scenes";
const sceneFiles = fs
  .readdirSync(scenesDir)
  .filter((f) => f.endsWith(".tsx"));

for (const file of sceneFiles) {
  const fullPath = path.join(scenesDir, file);
  const content = fs.readFileSync(fullPath, "utf8");

  // Regra 2: Proibição de subtração dupla de frame (currentFrame >= from ? currentFrame - from)
  if (content.includes("currentFrame >= from")) {
    console.error(
      `[Regra Frame-Local] ERRO em src/scenes/${file}: Uso de 'currentFrame >= from ? currentFrame - from' proibido! Dentro de <Sequence>, useCurrentFrame() já começa em 0.`
    );
    hasErrors = true;
  }

  // Regra 3: Proibição de marginTop no filho direto dentro de <Shake> ou <GlitchHit>
  const glitchOrShakeChildMargin = /<(?:GlitchHit|Shake|PunchIn)[^>]*>\s*<div\s+style=\{\{[^}]*marginTop:/g;
  if (glitchOrShakeChildMargin.test(content)) {
    console.error(
      `[Regra Margin-Clone] ERRO em src/scenes/${file}: 'marginTop' detectado no filho direto de <Shake>/<GlitchHit>/<PunchIn>! Coloque o marginTop em um <div> externo ao efeito para não desalinhar clones RGB.`
    );
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error("❌ Falha na auditoria de layout: corrija os erros acima antes de renderizar!");
  process.exit(1);
} else {
  console.log("✅ Sucesso: 100% dos efeitos e cenas seguem as regras de Zero Layout Shift e DOM Estável.");
}
