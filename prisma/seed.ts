import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.affiliate.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("12345678", 10);

  const user = await prisma.user.create({
    data: {
      email: "demo@dentplus.cl",
      password: passwordHash,
    },
  });

  const affiliates = [
    {
      firstName: "Camila",
      lastName: "Rojas",
      email: "camila.rojas@dentplus.cl",
      membershipType: "silver",
      userId: user.id,
    },
    {
      firstName: "Matías",
      lastName: "Pérez",
      email: "matias.perez@dentplus.cl",
      membershipType: "gold",
      userId: user.id,
    },
    {
      firstName: "Valentina",
      lastName: "Soto",
      email: "valentina.soto@dentplus.cl",
      membershipType: "platinum",
      userId: user.id,
    },
  ];

  await prisma.affiliate.createMany({ data: affiliates });

  const affiliateCount = await prisma.affiliate.count();
  const userCount = await prisma.user.count();

  console.log(`Inserted ${userCount} user.`);
  console.log(`Inserted ${affiliateCount} affiliates.`);
  console.log("Demo user: demo@dentplus.cl / 12345678");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
