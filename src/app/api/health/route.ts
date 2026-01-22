import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function checkDatabaseConnection(): Promise<{ ok: boolean; error?: string }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 400)
  
  try {
    await prisma.$queryRaw`SELECT 1`
    clearTimeout(timeoutId)
    return { ok: true }
  } catch (error) {
    clearTimeout(timeoutId)
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function GET() {
  try {
    const dbCheck = await checkDatabaseConnection()
    const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || null
    const dataBackend = process.env.DATA_BACKEND || 'mock'

    const response: {
      status: string
      db: string
      data_backend: string
      git_sha: string | null
      error?: string
    } = {
      status: 'ok',
      db: dbCheck.ok ? 'ok' : 'fail',
      data_backend: dataBackend,
      git_sha: gitSha
    }

    if (!dbCheck.ok && dbCheck.error) {
      response.error = dbCheck.error
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      status: 'ok',
      db: 'fail',
      data_backend: process.env.DATA_BACKEND || 'mock',
      git_sha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
