// 本地測試用：帶 COOP/COEP 的靜態 server（Godot web 需要跨源隔離）
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 8000;
const ROOT = __dirname;
const MIME = {
  '.html':'text/html', '.js':'application/javascript', '.wasm':'application/wasm',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg',
  '.svg':'image/svg+xml', '.ico':'image/x-icon', '.css':'text/css', '.pck':'application/octet-stream',
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404); return res.end('404');
  }
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream');
  fs.createReadStream(fp).pipe(res);
}).listen(PORT, () => console.log('http://localhost:' + PORT));
