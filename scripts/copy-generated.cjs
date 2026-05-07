const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src', 'generated', 'firemat-client');
const target = path.join(root, 'dist', 'generated', 'firemat-client');

if (!fs.existsSync(source)) {
  throw new Error(`No existe el cliente generado de Firemat: ${source}`);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(source, target, { recursive: true });
