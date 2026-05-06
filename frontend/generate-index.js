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
const indexJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

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

// Copy contents of dist/client to dist
import { cpSync } from 'fs';
cpSync(path.join(__dirname, 'dist', 'client'), distDir, { recursive: true });

console.log('Successfully generated dist/index.html and moved client assets.');
