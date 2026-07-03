import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function safeUnlink(filePath, retries = 5, delayMs = 150) {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.unlink(filePath);
      return;
    } catch (err) {
      if (err.code === "ENOENT") return; // already gone, fine
      if (err.code === "EBUSY" && i < retries - 1) {
        await new Promise(res => setTimeout(res, delayMs));
        continue;
      }
      console.warn(`Could not delete ${filePath} (${err.code}), skipping.`);
      return; // don't let cleanup failures kill the request
    }
  }
}

export async function generatePdf(latex) {
  const baseOutputDir = path.join(__dirname, "../output");
  if (!existsSync(baseOutputDir)) {
    mkdirSync(baseOutputDir, { recursive: true });
  }

  // Unique per-request dir avoids collisions between concurrent requests
  const jobId = randomUUID();
  const outputDir = path.join(baseOutputDir, jobId);
  mkdirSync(outputDir, { recursive: true });

  const texPath = path.join(outputDir, "resume.tex");
  const pdfPath = path.join(outputDir, "resume.pdf");

  await fs.writeFile(texPath, latex);

  try {
    await execAsync(
      `pdflatex -interaction=nonstopmode -halt-on-error -output-directory="${outputDir}" "${texPath}"`
    );

    if (!existsSync(pdfPath)) {
      throw new Error("PDF generation failed.");
    }

    // Best-effort cleanup; failures here must never throw
    await Promise.all(
      ["resume.aux", "resume.log", "resume.out"].map(file =>
        safeUnlink(path.join(outputDir, file))
      )
    );

    return pdfPath;
  } catch (err) {
    console.error("PDF Generation Error:", err);
    throw new Error("Unable to generate PDF.");
  }
}