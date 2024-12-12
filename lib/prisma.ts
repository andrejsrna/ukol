import { PrismaClient } from "@prisma/client";

// Definujeme typ pre globálny objekt
type GlobalWithPrisma = typeof globalThis & {
  prisma: PrismaClient;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as GlobalWithPrisma).prisma) {
    (global as GlobalWithPrisma).prisma = new PrismaClient();
  }
  prisma = (global as GlobalWithPrisma).prisma;
}

export { prisma }; 