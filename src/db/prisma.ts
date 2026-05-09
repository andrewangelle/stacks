import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var -- Prisma singleton pattern on globalThis
  var prisma: PrismaClient | undefined;
}

prisma =
  globalThis.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma };
