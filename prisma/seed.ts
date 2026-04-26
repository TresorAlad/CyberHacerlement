import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL manquante");
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    ssl: { rejectUnauthorized: false },
  });

  return {
    prisma: new PrismaClient({ adapter: new PrismaPg(pool) }),
    pool,
  };
}

async function upsertCredentialUser(
  prisma: PrismaClient,
  input: {
    email: string;
    name: string;
    role: "ADMIN" | "VICTIM";
    password: string;
  }
) {
  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.user.upsert({
    where: { email: input.email },
    create: {
      email: input.email,
      name: input.name,
      role: input.role,
      emailVerified: true,
      accounts: {
        create: {
          providerId: "credential",
          accountId: input.email,
          password: passwordHash,
        },
      },
    },
    update: {
      name: input.name,
      role: input.role,
      emailVerified: true,
      accounts: {
        upsert: {
          where: {
            providerId_accountId: {
              providerId: "credential",
              accountId: input.email,
            },
          },
          create: {
            providerId: "credential",
            accountId: input.email,
            password: passwordHash,
          },
          update: {
            password: passwordHash,
          },
        },
      },
    },
  });
}

async function main() {
  const { prisma, pool } = createPrisma();

  const categories = [
    { slug: "menaces", label: "Menaces / intimidation" },
    { slug: "harc-sexuel", label: "Harcèlement sexuel" },
    { slug: "cyberintimidation", label: "Cyberintimidation" },
    { slug: "doxxing", label: "Doxxing / divulgation d’informations" },
    { slug: "usurpation", label: "Usurpation d’identité / faux comptes" },
    { slug: "revenge-porn", label: "Revenge porn / diffusion intime" },
    { slug: "autre", label: "Autre" },
  ] as const;

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { slug: c.slug, label: c.label },
      update: { label: c.label },
    });
  }

  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const victimPassword = process.env.SEED_VICTIM_PASSWORD ?? "ChangeMe123!";

  await upsertCredentialUser(prisma, {
    email: "admin@cobra-kill.local",
    name: "Admin Cobra Kill",
    role: "ADMIN",
    password: adminPassword,
  });

  await upsertCredentialUser(prisma, {
    email: "victime@cobra-kill.local",
    name: "Victime (démo)",
    role: "VICTIM",
    password: victimPassword,
  });

  // eslint-disable-next-line no-console
  console.log("Seed OK (catégories + comptes admin et utilisateur démo).");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
