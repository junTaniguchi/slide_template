#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const usage = `Usage: node scripts/import-package.mjs <package.txt | ->

The package text must contain code fences in the form:
\n\`\`\`file=relative/path.ext
...contents...
\`\`\`
`;

const inputPath = process.argv[2];
if (!inputPath) {
  console.error(usage);
  process.exit(1);
}

const text = inputPath === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(inputPath), 'utf8');
const blockRegex = /```([^\n]*?file=([^\n]+)[^\n]*)\n([\s\S]*?)```/g;
let match;
let count = 0;

while ((match = blockRegex.exec(text)) !== null) {
  const filePath = match[2].trim();
  const content = match[3];
  const abs = resolve(filePath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content, 'utf8');
  console.log(`Wrote ${filePath}`);
  count++;
}

if (!count) {
  console.error('No file blocks found. Use ```file=relative/path``` fences.');
  process.exit(1);
}
