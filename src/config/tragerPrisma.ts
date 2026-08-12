
import 'dotenv/config';
import { PrismaClient } from '../generated/trager-client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.TRAGGER_DATABASE_URL;

if (!connectionString) {
  throw new Error('TRAGGER_DATABASE_URL no esta definida en el entorno');
}

const tragerPool = new Pool({
  connectionString,
});

const tragerAdapter = new PrismaPg(tragerPool);

export const tragerPrisma = new PrismaClient({
  adapter: tragerAdapter,
});

process.on('SIGINT', async () => {
  await tragerPrisma.$disconnect();
  await tragerPool.end();
});

process.on('SIGTERM', async () => {
  await tragerPrisma.$disconnect();
  await tragerPool.end();
});
