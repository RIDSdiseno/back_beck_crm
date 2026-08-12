const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function copyGenerated(name) {
  const source = path.join(root, 'src', 'generated', name);
  const target = path.join(root, 'dist', 'generated', name);

  if (!fs.existsSync(source)) {
    throw new Error(`No existe el cliente generado: ${source}`);
  }

  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

copyGenerated('firemat-client');
copyGenerated('trager-client');
