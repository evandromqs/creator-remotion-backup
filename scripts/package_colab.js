const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Empacotando projeto para o Google Colab...');

const zipName = 'project.zip';
const zipPath = path.resolve(__dirname, '..', zipName);

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// Compacta excluindo node_modules, out e .git
const cmd = `powershell -Command "Compress-Archive -Path src, public, package.json, package-lock.json, tsconfig.json, remotion.config.ts, build.cjs -DestinationPath ${zipName} -Force"`;
console.log('Executando:', cmd);
execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
console.log(`\n✅ ${zipName} gerado com sucesso! (${sizeMb} MB)`);
console.log('Agora você pode arrastar este arquivo para o Google Colab para renderizar em alta velocidade!');
