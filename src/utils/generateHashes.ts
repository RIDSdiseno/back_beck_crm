/**
 * Script para generar hashes de contraseñas para usuarios de prueba
 * Ejecutar con: ts-node src/utils/generateHashes.ts
 */

import bcrypt from 'bcryptjs';

const passwords = [
  { user: 'admin@beck.com', password: 'Admin123!' },
  { user: 'terreno@beck.com', password: 'Terreno123!' },
  { user: 'ing@beck.com', password: 'Ing123!' },
  { user: 'view@beck.com', password: 'View123!' },
];

async function generateHashes() {
  console.log('🔐 Generando hashes de contraseñas...\n');

  for (const { user, password } of passwords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Usuario: ${user}`);
    console.log(`Contraseña: ${password}`);
    console.log(`Hash: ${hash}\n`);
  }

  console.log('✅ Hashes generados. Copia estos valores al archivo database-schema.sql');
}

generateHashes().catch(console.error);
