import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const opsPasswordHash = await bcrypt.hash('password123', 10)
  const procurementPasswordHash = await bcrypt.hash('password123', 10)

  const opsUser = await prisma.user.upsert({
    where: { email: 'ops@abco.com' },
    update: {},
    create: {
      email: 'ops@abco.com',
      passwordHash: opsPasswordHash,
      role: 'ops',
      name: 'ABCO Operations'
    }
  })

  const procurementUser = await prisma.user.upsert({
    where: { email: 'procurement@eurocell.com' },
    update: {},
    create: {
      email: 'procurement@eurocell.com',
      passwordHash: procurementPasswordHash,
      role: 'procurement',
      name: 'Eurocell Procurement'
    }
  })

  console.log('Created users:')
  console.log('  - ops@abco.com (role: ops)')
  console.log('  - procurement@eurocell.com (role: procurement)')
  console.log('')
  console.log('Password for both accounts: password123')
  console.log('')
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
