import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

const affiliates = [
  { firstName: 'Camila', lastName: 'Rojas', email: 'camila.rojas@dentplus.cl', membershipType: 'silver' },
  { firstName: 'Matías', lastName: 'Pérez', email: 'matias.perez@dentplus.cl', membershipType: 'gold' },
  { firstName: 'Valentina', lastName: 'Soto', email: 'valentina.soto@dentplus.cl', membershipType: 'platinum' },
]

async function main() {
  console.log('Seeding database...')

  await prisma.affiliate.deleteMany()
  await prisma.affiliate.createMany({ data: affiliates })

  const count = await prisma.affiliate.count()
  console.log(`Inserted ${count} affiliates.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
