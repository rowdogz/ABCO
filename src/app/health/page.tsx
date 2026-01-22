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

export default async function HealthPage() {
  const dbStatus = await checkDatabaseConnection()
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || 'unknown'
  const dataBackend = process.env.DATA_BACKEND || 'mock'
  const nodeEnv = process.env.NODE_ENV || 'development'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Health Check</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">App Version (Git SHA)</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {gitSha.substring(0, 7)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Database Connectivity</td>
                <td className="px-6 py-4 text-sm">
                  {dbStatus.ok ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      OK
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      FAIL: {dbStatus.error}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">DATA_BACKEND</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{dataBackend}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Environment</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{nodeEnv}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          ABCO Product Management
        </div>
      </div>
    </div>
  )
}
