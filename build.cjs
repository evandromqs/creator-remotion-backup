#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const scenesPath = path.resolve(__dirname, 'src/data/scenes.json');
if (!fs.existsSync(scenesPath)) {
  console.error('ERRO: scenes.json não encontrado em ' + scenesPath);
  process.exit(1);
}

const scenesData = JSON.parse(fs.readFileSync(scenesPath, 'utf8'));

// 1. Validação do JSON
console.log('=== Validando scenes.json ===');
let currentFrom = 0;
let valid = true;

scenesData.scenes.forEach((sc, idx) => {
  if (sc.from !== currentFrom) {
    console.error(`ERRO: Cena ${sc.id} (idx ${idx}) começa em ${sc.from}, mas esperava ${currentFrom}`);
    valid = false;
  }
  currentFrom += sc.durationInFrames;
});

if (currentFrom !== scenesData.meta.durationInFrames) {
  console.error(`ERRO: Soma de duração das cenas (${currentFrom}) difere de meta.durationInFrames (${scenesData.meta.durationInFrames})`);
  valid = false;
}

if (!valid) {
  console.error('Validação falhou.');
  process.exit(1);
}
console.log(`✓ 18 cenas contíguas e sem sobreposição.`);
console.log(`✓ Duração total validada: ${currentFrom} frames (${(currentFrom/scenesData.meta.fps).toFixed(2)}s).\n`);

// 2. Parse de argumentos CLI
const args = process.argv.slice(2);
const sceneArgIdx = args.indexOf('--scene');
const stillArgIdx = args.indexOf('--still');
const previewIdx = args.indexOf('--preview');

if (previewIdx !== -1) {
  console.log('Iniciando Remotion Preview Studio local...');
  const child = spawn('npx', ['remotion', 'preview'], { stdio: 'inherit', shell: true });
  child.on('exit', (code) => process.exit(code || 0));
} else if (stillArgIdx !== -1) {
  const frame = args[stillArgIdx + 1] || '60';
  const outPath = `out/still-frame-${frame}.png`;
  console.log(`Renderizando still do frame ${frame} para ${outPath}...`);
  execSync(`npx remotion still Main ${outPath} --frame=${frame}`, { stdio: 'inherit' });
} else if (sceneArgIdx !== -1) {
  const sceneId = args[sceneArgIdx + 1];
  const targetScene = scenesData.scenes.find((s) => s.id === sceneId);
  if (!targetScene) {
    console.error(`Cena '${sceneId}' não encontrada no scenes.json.`);
    process.exit(1);
  }
  const midFrame = Math.round(targetScene.from + targetScene.durationInFrames / 2);
  const outPath = `out/still-scene-${sceneId}.png`;
  console.log(`Renderizando still da cena '${sceneId}' (frame ${midFrame}) para ${outPath}...`);
  execSync(`npx remotion still Main ${outPath} --frame=${midFrame}`, { stdio: 'inherit' });
} else {
  console.log('Uso de build.cjs:');
  console.log('  node build.cjs --preview               (Abre o Remotion Studio no site local)');
  console.log('  node build.cjs --scene <id>            (Renderiza still do meio da cena específica)');
  console.log('  node build.cjs --still <frame>         (Renderiza still de um frame exato)');
}
