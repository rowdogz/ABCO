import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function seedUsers() {
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

  return [opsUser, procurementUser]
}

export async function POST() {
  try {
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      const users = await seedUsers()
      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully (first-time setup)',
        users: users.map(u => ({ email: u.email, role: u.role }))
      })
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - users already exist, login required' }, { status: 401 })
    }

    if (session.user.role !== 'ops') {
      return NextResponse.json({ error: 'Forbidden - ops role required' }, { status: 403 })
    }

    const users = await seedUsers()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      users: users.map(u => ({ email: u.email, role: u.role }))
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ops') {
      return NextResponse.json({ error: 'Forbidden - ops role required' }, { status: 403 })
    }

    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: { email: true, role: true, name: true }
    })

    return NextResponse.json({
      seeded: userCount > 0,
      userCount,
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
