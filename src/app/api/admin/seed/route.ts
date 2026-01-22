import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

function validateSeedToken(request: NextRequest): boolean {
  const seedToken = process.env.SEED_TOKEN
  if (!seedToken) {
    return false
  }
  
  const providedToken = request.headers.get('x-seed-token')
  return providedToken === seedToken
}

async function seedUsers(): Promise<{ created: number; users: Array<{ email: string; role: string }> }> {
  const opsPasswordHash = await bcrypt.hash('password123', 10)
  const procurementPasswordHash = await bcrypt.hash('password123', 10)

  let createdCount = 0

  const existingOps = await prisma.user.findUnique({ where: { email: 'ops@abco.com' } })
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
  if (!existingOps) createdCount++

  const existingProcurement = await prisma.user.findUnique({ where: { email: 'procurement@eurocell.com' } })
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
  if (!existingProcurement) createdCount++

  return {
    created: createdCount,
    users: [
      { email: opsUser.email, role: opsUser.role },
      { email: procurementUser.email, role: procurementUser.role }
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateSeedToken(request)) {
      return NextResponse.json({ 
        error: 'Unauthorized - invalid or missing SEED_TOKEN' 
      }, { status: 401 })
    }

    const result = await seedUsers()

    return NextResponse.json({
      seeded: true,
      users_created: result.created,
      message: result.created > 0 
        ? `Database seeded successfully. Created ${result.created} user(s).`
        : 'Database already seeded. No new users created.',
      users: result.users
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ 
      seeded: false,
      users_created: 0,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!validateSeedToken(request)) {
      return NextResponse.json({ 
        error: 'Unauthorized - invalid or missing SEED_TOKEN' 
      }, { status: 401 })
    }

    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: { email: true, role: true, name: true }
    })

    return NextResponse.json({
      seeded: userCount > 0,
      user_count: userCount,
      users
    })
  } catch (error) {
    console.error('Error checking seed status:', error)
    return NextResponse.json({ 
      error: 'Failed to check seed status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
