import fs from "fs";
import path from "path";

const scenesDir = "src/scenes";
const files = fs.readdirSync(scenesDir).filter(f => f.startsWith("S") && f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(scenesDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Substitui const f = currentFrame - from;
  content = content.replace(
    /const f = currentFrame - from;/g,
    "const f = Math.max(0, currentFrame >= from ? currentFrame - from : currentFrame);"
  );

  if (file === "S11_Evolucao.tsx") {
    content = content.replace(
      /const stage = Math\.min\(3, Math\.floor\(f \/ 45\)\);/g,
      "const stage = Math.max(0, Math.min(3, Math.floor(f / 45)));"
    );
  }

  fs.writeFileSync(filePath, content);
  console.log(`[Fixed] ${file}`);
}
