import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

async function main() {
  const args = process.argv.slice(2);
  const inputArg = args[0] || "public/assets/test-raw.png";
  const outputArg = args[1] || "public/assets/test-transparent.png";

  const inputPath = path.resolve(process.cwd(), inputArg);
  const outputPath = path.resolve(process.cwd(), outputArg);

  if (!fs.existsSync(inputPath)) {
    console.error(`[Error] Arquivo de entrada não encontrado: ${inputPath}`);
    process.exit(1);
  }

  console.log(`[RemoveBG] Processando remoção de fundo local via @imgly/background-removal-node...`);
  console.log(`Entrada: ${inputPath}`);
  console.log(`Saída:   ${outputPath}`);

  const startTime = Date.now();

  try {
    // Compatibilidade cross-platform (Windows/Linux/macOS) via pathToFileURL
    const fileUrl = pathToFileURL(inputPath).href;

    const resultBlob = await removeBackground(fileUrl, {
      output: {
        format: "image/png",
        quality: 1.0,
      },
    });

    const arrayBuffer = await resultBlob.arrayBuffer();
    const resultBuffer = Buffer.from(arrayBuffer);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, resultBuffer);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const sizeKb = (resultBuffer.length / 1024).toFixed(2);

    console.log(`[Success] Fundo removido com sucesso em ${elapsed}s!`);
    console.log(`Arquivo salvo: ${outputPath} (${sizeKb} KB)`);
  } catch (err) {
    console.error(`[Error] Falha ao processar remoção de fundo:`, err);
    process.exit(1);
  }
}

main();
