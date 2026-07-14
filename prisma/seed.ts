import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@optimanager.com";
  const operatorEmail = "oticaeverardo@optimanager.com";
  const defaultPassword = "123456";

  console.log("Seeding database with multi-tenant roles...");

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Upsert Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user seeded: ${adminUser.name} (${adminUser.email})`);

  // 2. Upsert Operator User
  const operatorUser = await prisma.user.upsert({
    where: { email: operatorEmail },
    update: {
      name: "Ótica Everardo",
      password: hashedPassword,
      role: "OPERATOR",
    },
    create: {
      email: operatorEmail,
      name: "Ótica Everardo",
      password: hashedPassword,
      role: "OPERATOR",
    },
  });
  console.log(`Operator user seeded: ${operatorUser.name} (${operatorUser.email})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("Seed completed successfully.");
  })
  .catch(async (e) => {
    console.error("Error during seed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
