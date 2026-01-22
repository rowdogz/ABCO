import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function checkDatabaseConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { ok: true }
  } catch (error) {
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function GET() {
  const dbStatus = await checkDatabaseConnection()
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || 'unknown'
  const dataBackend = process.env.DATA_BACKEND || 'mock'
  const nodeEnv = process.env.NODE_ENV || 'development'

  const health = {
    status: dbStatus.ok ? 'healthy' : 'unhealthy',
    version: gitSha.substring(0, 7),
    database: dbStatus,
    dataBackend,
    environment: nodeEnv,
    timestamp: new Date().toISOString()
  }

  return NextResponse.json(health, { 
    status: dbStatus.ok ? 200 : 503 
  })
}
