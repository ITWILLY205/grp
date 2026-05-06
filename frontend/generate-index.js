import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.join(__dirname, 'dist', 'client', 'assets');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(clientDir)) {
  console.error("Client build not found. Run 'vite build' first.");
  process.exit(1);
}

const files = fs.readdirSync(clientDir);
const indexJsCandidates = files.filter(f => f.startsWith('index-') && f.endsWith('.js'));
// The entry bundle is always the largest (it includes React + router + vendors)
const indexJs = indexJsCandidates.sort((a, b) => {
  const sizeA = fs.statSync(path.join(clientDir, a)).size;
  const sizeB = fs.statSync(path.join(clientDir, b)).size;
  return sizeB - sizeA;
})[0];
const cssFile = files.find(f => f.endsWith('.css'));

// Patch the entry bundle: replace hydrateRoot(document, ...) with createRoot(document).render(...)
// This is required because we deploy as a static site without SSR, so hydration would crash.
const entryBundlePath = path.join(clientDir, indexJs);
let bundleContent = fs.readFileSync(entryBundlePath, 'utf-8');
const patchedContent = bundleContent.replace(
  /\.hydrateRoot\s*\(\s*document\s*,/g,
  '.createRoot(document).render('
);
if (patchedContent !== bundleContent) {
  fs.writeFileSync(entryBundlePath, patchedContent);
  // Also patch the copy in dist/assets (created by cpSync later)
  const distAssetsPath = path.join(distDir, 'assets', indexJs);
  if (fs.existsSync(distAssetsPath)) {
    fs.writeFileSync(distAssetsPath, patchedContent);
  }
  console.log('Patched entry bundle: hydrateRoot -> createRoot().render()');
} else {
  console.warn('Warning: Could not find hydrateRoot call to patch in entry bundle.');
}

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>School Management System</title>
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : ''}
  </head>
  <body>
    <!-- Tanstack Start will hydrate this document -->
    <script type="module" src="/assets/${indexJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), html);
// Copy index.html to 404.html so static hosts serve it for all client-side routes
fs.writeFileSync(path.join(distDir, '404.html'), html);

// Copy contents of dist/client to dist
import { cpSync } from 'fs';
cpSync(path.join(__dirname, 'dist', 'client'), distDir, { recursive: true });

// Re-apply patch to the copied bundle if cpSync overwrote it
const copiedBundlePath = path.join(distDir, 'assets', indexJs);
if (fs.existsSync(copiedBundlePath)) {
  const copiedContent = fs.readFileSync(copiedBundlePath, 'utf-8');
  if (!copiedContent.includes('.createRoot(document).render(')) {
    fs.writeFileSync(copiedBundlePath, patchedContent);
  }
}

// Generate vercel.json for SPA routing
const vercelConfig = {
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
};
fs.writeFileSync(path.join(distDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));

console.log('Successfully generated dist/index.html, dist/404.html, dist/vercel.json and moved client assets.');
