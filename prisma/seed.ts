import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  await prisma.affiliate.createMany({
    data: [
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
    ],
  });

  const userCount = await prisma.user.count();
  const affiliateCount = await prisma.affiliate.count();

  console.log(`Inserted ${userCount} user.`);
  console.log(`Inserted ${affiliateCount} affiliates.`);
  console.log("Demo user: demo@dentplus.cl / 12345678");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
