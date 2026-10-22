const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4'
};

const verifyPaymentHandler = require('./api/verify-payment');
const paystackWebhookHandler = require('./api/paystack-webhook');

const server = http.createServer(async (req, res) => {
  // Decorate response object to emulate Vercel serverless environment
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  res.send = (data) => {
    res.end(data);
  };

  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1:3000'}`);
  const pathname = url.pathname;
  req.query = Object.fromEntries(url.searchParams);

  // Route API requests
  if (pathname === '/api/verify-payment') {
    return verifyPaymentHandler(req, res);
  }

  if (pathname === '/api/paystack-webhook') {
    return paystackWebhookHandler(req, res);
  }

  // Static file serving
  const urlPath = decodeURIComponent(pathname);
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
