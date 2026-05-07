// src/config/firematPrisma.ts

import 'dotenv/config';
import { PrismaClient } from '../generated/firemat-client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.FIREMAT_DATABASE_URL;

if (!connectionString) {
  throw new Error('FIREMAT_DATABASE_URL no esta definida en el entorno');
}

const firematPool = new Pool({
  connectionString,
});

const firematAdapter = new PrismaPg(firematPool);

export const firematPrisma = new PrismaClient({
  adapter: firematAdapter,
});

process.on('SIGINT', async () => {
  await firematPrisma.$disconnect();
  await firematPool.end();
});

process.on('SIGTERM', async () => {
  await firematPrisma.$disconnect();
  await firematPool.end();
});