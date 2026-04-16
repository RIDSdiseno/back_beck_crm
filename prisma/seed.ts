import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Usuarios de prueba
  const adminId = '11111111-1111-1111-1111-111111111111';
  const terrenoId = '22222222-2222-2222-2222-222222222222';
  const ingenieriaId = '33333333-3333-3333-3333-333333333333';
  const visualizadorId = '44444444-4444-4444-4444-444444444444';

  // Crear usuarios
  await prisma.usuario.createMany({
    data: [
      {
        id: adminId,
        nombre: 'Admin Demo',
        email: 'admin@beck.com',
        passwordHash: await bcrypt.hash('Admin123!', 10),
        rol: 'administrador',
        activo: true,
      },
      {
        id: terrenoId,
        nombre: 'Terreno Demo',
        email: 'terreno@beck.com',
        passwordHash: await bcrypt.hash('Terreno123!', 10),
        rol: 'terreno',
        activo: true,
      },
      {
        id: ingenieriaId,
        nombre: 'Ingeniero Demo',
        email: 'ing@beck.com',
        passwordHash: await bcrypt.hash('Ing123!', 10),
        rol: 'ingenieria',
        activo: true,
      },
      {
        id: visualizadorId,
        nombre: 'Visualizador Demo',
        email: 'view@beck.com',
        passwordHash: await bcrypt.hash('View123!', 10),
        rol: 'visualizador',
        activo: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Usuarios creados');

  // Crear obras
  const obraId1 = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const obraId2 = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  await prisma.obra.createMany({
    data: [
      {
        id: obraId1,
        nombre: 'Edificio Central Tower',
        codigo: 'ECT-2025',
        descripcion: 'Edificio corporativo de 15 pisos con certificación LEED',
        estado: 'activa',
        creadoPorId: adminId,
      },
      {
        id: obraId2,
        nombre: 'Proyecto Residencial Los Álamos',
        codigo: 'PRLA-2025',
        descripcion: 'Conjunto residencial con 4 torres',
        estado: 'activa',
        creadoPorId: adminId,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Obras creadas');

  // Crear itemizados
  await prisma.itemizado.createMany({
    data: [
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        codigo: 'SELLO-CF-01',
        nombre: 'Sello cortafuego estándar 100mm',
        descripcion: 'Sello cortafuego para ductos hasta 100mm',
        precioUnitario: 15000,
        creadoPorId: adminId,
      },
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        codigo: 'SELLO-CF-02',
        nombre: 'Sello cortafuego reforzado 200mm',
        descripcion: 'Sello cortafuego para ductos 100-200mm',
        precioUnitario: 28000,
        creadoPorId: adminId,
      },
      {
        id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        codigo: 'JUNTA-ESP-01',
        nombre: 'Junta lineal con espuma intumescente',
        descripcion: 'Sistema de junta perimetral expandible',
        precioUnitario: 45000,
        creadoPorId: adminId,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Itemizados creados');

  console.log('🎉 Seeding completado!');
  console.log('');
  console.log('📧 Usuarios de prueba:');
  console.log('  Admin:        admin@beck.com / Admin123!');
  console.log('  Terreno:      terreno@beck.com / Terreno123!');
  console.log('  Ingeniería:   ing@beck.com / Ing123!');
  console.log('  Visualizador: view@beck.com / View123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
