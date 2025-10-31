import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbFilePath = path.resolve('data', 'data.sqlite');
fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

// Ensure products table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
  )
`).run();

export function seedIfEmpty() {
  const row = db.prepare('SELECT COUNT(1) as count FROM products').get();
  if (row.count === 0) {
    const insert = db.prepare('INSERT INTO products (sku, name, stock) VALUES (?, ?, ?)');
    const seedProducts = [
      ['CASE-IPHN', 'Capinha para iPhone', 15],
      ['IPHN-15-BLK', 'iPhone 15 Preto 128GB', 12],
      ['IPHN-15-PNK', 'iPhone 15 Rosa 128GB', 7],
      ['AIRP-3RD', 'AirPods (3ª geração)', 20],
      ['APWT-S9', 'Apple Watch Series 9', 9],
      ['MGSF-15W', 'Carregador MagSafe 15W', 30]
    ];
    const tx = db.transaction((rows) => {
      for (const r of rows) insert.run(r);
    });
    tx(seedProducts);
  }
}

export function listProducts() {
  return db.prepare('SELECT id, sku, name, stock FROM products ORDER BY id ASC').all();
}

export function getProductById(id) {
  return db.prepare('SELECT id, sku, name, stock FROM products WHERE id = ?').get(id);
}

export function getProductBySku(sku) {
  return db.prepare('SELECT id, sku, name, stock FROM products WHERE sku = ?').get(sku);
}

export function setStockById(id, stock) {
  const result = db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(stock, id);
  return result.changes > 0;
}

export function adjustStockById(id, delta) {
  const product = getProductById(id);
  if (!product) return { ok: false, error: 'Produto não encontrado' };
  const newStock = product.stock + delta;
  if (newStock < 0) return { ok: false, error: 'Estoque insuficiente' };
  setStockById(id, newStock);
  return { ok: true, stock: newStock };
}

export default db;


