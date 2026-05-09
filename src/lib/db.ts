import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
});

export const db = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL is required.');
  }

  return url.replace('sslmode=require', 'sslmode=verify-full');
}
