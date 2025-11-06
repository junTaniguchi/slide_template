#!/usr/bin/env node
/**
 * Simple helper script (optional).
 * Reads a JSON file and injects it into an HTML template by writing
 * <script>window.SLIDE_DATA = ...</script> before </body>.
 *
 * Usage:
 *   node scripts/inject-slide-data.mjs public/slide_template/dual_style_slide_template.html public/data/slides.json dist/index.html
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function main() {
  const [templatePath, dataPath, outputPath] = process.argv.slice(2);
  if (!templatePath || !dataPath || !outputPath) {
    console.error('Usage: node scripts/inject-slide-data.mjs <template.html> <data.json> <output.html>');
    process.exit(1);
  }

  const [html, json] = await Promise.all([
    readFile(resolve(templatePath), 'utf8'),
    readFile(resolve(dataPath), 'utf8'),
  ]);

  const payload = `\n    <script>window.SLIDE_DATA = ${json.trim()};<\/script>\n  </body>`;
  const output = html.replace(/\s*<\/?body[^>]*>/i, (match) => match); // ensure body exists
  const replaced = output.replace(/<\/body>/i, payload);
  await writeFile(resolve(outputPath), replaced, 'utf8');
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
