import fs from "fs";
import path from "path";

const scenesDir = path.resolve(process.cwd(), "src/scenes");
const files = fs.readdirSync(scenesDir).filter((f) => f.startsWith("Scene") && f.endsWith(".tsx"));

for (const file of files) {
  const p = path.join(scenesDir, file);
  let content = fs.readFileSync(p, "utf8");

  // Remove the declaration line first before checking if fps is used
  const hasFpsUsage = content
    .replace(/const\s*{\s*fps\s*}\s*=\s*useVideoConfig\(\);/g, "")
    .replace(/import.*from\s*["']remotion["'];/g, "")
    .includes("fps");

  const hasSpring = content
    .replace(/import.*from\s*["']remotion["'];/g, "")
    .includes("spring(");

  const hasInterpolate = content
    .replace(/import.*from\s*["']remotion["'];/g, "")
    .includes("interpolate(");

  // If not using fps, remove useVideoConfig line
  if (!hasFpsUsage) {
    content = content.replace(/\s*const\s*{\s*fps\s*}\s*=\s*useVideoConfig\(\);/g, "");
  }

  // Rebuild imports
  const remotionImports = ["AbsoluteFill", "useCurrentFrame"];
  if (hasFpsUsage) remotionImports.push("useVideoConfig");
  if (hasInterpolate) remotionImports.push("interpolate");
  if (hasSpring) remotionImports.push("spring");

  content = content.replace(
    /import\s*{[^}]+}\s*from\s*["']remotion["'];/,
    `import { ${remotionImports.join(", ")} } from "remotion";`
  );

  fs.writeFileSync(p, content);
}

console.log("Cleaned unused imports from all scenes accurately!");
