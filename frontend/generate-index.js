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

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>School Management System</title>
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : ''}
    <style>
      #fallback { font-family: system-ui; padding: 40px; text-align: center; color: #333; }
      #fallback h1 { margin: 0 0 16px; font-size: 24px; }
      #fallback p { margin: 0; color: #666; }
    </style>
    <script>
      window.addEventListener('error', function(e) {
        console.error('Global error:', e.error ? e.error.stack : e.message);
        var fb = document.getElementById('fallback');
        if (fb) { fb.innerHTML = '<h1>JavaScript Error</h1><p>' + (e.message || 'Unknown error') + '</p><p>Check the browser console for details.</p>'; }
      });
    </script>
  </head>
  <body>
    <div id="fallback">
      <h1>Loading School Management System...</h1>
      <p>If this message persists, JavaScript may be blocked or an error occurred.</p>
    </div>
    <script type="module" src="/assets/${indexJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), html);
fs.writeFileSync(path.join(distDir, '404.html'), html);

// Copy contents of dist/client to dist
import { cpSync } from 'fs';
cpSync(path.join(__dirname, 'dist', 'client'), distDir, { recursive: true });

// vercel.json: serve existing files first, then fallback to index.html for SPA routes
const vercelConfig = {
  "rewrites": [
    { "source": "/assets/(.*)", "destination": "/assets/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
};
fs.writeFileSync(path.join(distDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));

console.log('Successfully generated dist/index.html, dist/404.html, dist/vercel.json and moved client assets.');
