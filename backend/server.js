import express from 'express';
import cors from 'cors';
import {
  seedIfEmpty,
  listProducts,
  getProductById,
  getProductBySku,
  setStockById,
  adjustStockById
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Seed database on boot if empty
seedIfEmpty();

// Root route (informativa)
app.get('/', (_req, res) => {
  res.type('text/plain').send([
    'API de estoque: use os endpoints abaixo:',
    '',
    'GET  /api/health',
    'GET  /api/products',
    'GET  /api/stock?sku=IPHN-15-PNK',
    'PUT  /api/products/:id/stock   { "stock": 10 }',
    'PATCH /api/products/:id/stock  { "delta": -1 }'
  ].join('\n'));
});

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// List all products
app.get('/api/products', (req, res) => {
  const products = listProducts();
  const wantsHtml = (req.headers['accept'] || '').includes('text/html');
  if (wantsHtml) {
    const rows = products.map(p => `
      <tr>
        <td>${p.id}</td>
        <td><code>${p.sku}</code></td>
        <td>${p.name}</td>
        <td>${p.stock}</td>
      </tr>
    `).join('');
    const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Produtos • API de Estoque</title>
    <style>
      :root { --bg:#0f172a; --card:#111827; --txt:#e5e7eb; --muted:#9ca3af; --accent:#22d3ee; }
      html,body{margin:0;padding:0;background:var(--bg);color:var(--txt);font:14px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"}
      .wrap{max-width:960px;margin:40px auto;padding:0 16px}
      h1{font-size:22px;margin:0 0 16px}
      .card{background:linear-gradient(180deg,#111827,#0b1220);border:1px solid #1f2937;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3)}
      table{width:100%;border-collapse:collapse}
      th,td{padding:12px 14px;border-bottom:1px solid #1f2937;text-align:left}
      th{color:var(--muted);font-weight:600;letter-spacing:.02em}
      tr:hover td{background:#0b1220}
      code{color:var(--accent)}
      .links{margin:16px 0 24px}
      .links a{color:var(--accent);text-decoration:none;margin-right:16px}
      .links a:hover{text-decoration:underline}
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>Produtos (API de Estoque)</h1>
      <div class="links">
        <a href="/api/health">/api/health</a>
        <a href="/api/stock?sku=IPHN-15-PNK">/api/stock?sku=...</a>
      </div>
      <div class="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Nome</th>
              <th>Estoque</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  </body>
 </html>`;
    res.type('html').send(html);
  } else {
    res.json(products);
  }
});

// Get product by id
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = getProductById(id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// Get stock by SKU or ID
app.get('/api/stock', (req, res) => {
  const { sku, id } = req.query;
  let product;
  if (sku) product = getProductBySku(String(sku));
  else if (id) product = getProductById(Number(id));
  else return res.status(400).json({ error: 'Informe sku ou id' });
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ id: product.id, sku: product.sku, stock: product.stock });
});

// Set stock absolute value by ID
app.put('/api/products/:id/stock', (req, res) => {
  const id = Number(req.params.id);
  const { stock } = req.body;
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'stock deve ser um número >= 0' });
  }
  const ok = setStockById(id, stock);
  if (!ok) return res.status(404).json({ error: 'Produto não encontrado' });
  const product = getProductById(id);
  res.json({ id: product.id, sku: product.sku, stock: product.stock });
});

// Adjust stock relatively (+/-) by ID
app.patch('/api/products/:id/stock', (req, res) => {
  const id = Number(req.params.id);
  const { delta } = req.body;
  if (typeof delta !== 'number' || !Number.isFinite(delta)) {
    return res.status(400).json({ error: 'delta deve ser um número' });
  }
  const result = adjustStockById(id, delta);
  if (!result.ok) return res.status(400).json({ error: result.error });
  const product = getProductById(id);
  res.json({ id: product.id, sku: product.sku, stock: product.stock });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API de estoque rodando em http://localhost:${PORT}`);
});


