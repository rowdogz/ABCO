import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

describe('Seed Endpoint Token Validation', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('rejects request when SEED_TOKEN env var is not set', async () => {
    vi.stubEnv('SEED_TOKEN', '')
    
    const { POST } = await import('../route')
    
    const mockRequest = new NextRequest('http://localhost/api/admin/seed', {
      method: 'POST',
      headers: { 'x-seed-token': 'some-token' }
    })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toContain('invalid or missing SEED_TOKEN')
  })

  it('rejects request when x-seed-token header is missing', async () => {
    vi.stubEnv('SEED_TOKEN', 'valid-secret-token')
    
    const { POST } = await import('../route')
    
    const mockRequest = new NextRequest('http://localhost/api/admin/seed', {
      method: 'POST'
    })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toContain('invalid or missing SEED_TOKEN')
  })

  it('rejects request when x-seed-token header does not match SEED_TOKEN', async () => {
    vi.stubEnv('SEED_TOKEN', 'valid-secret-token')
    
    const { POST } = await import('../route')
    
    const mockRequest = new NextRequest('http://localhost/api/admin/seed', {
      method: 'POST',
      headers: { 'x-seed-token': 'wrong-token' }
    })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toContain('invalid or missing SEED_TOKEN')
  })

  it('GET endpoint also rejects invalid token', async () => {
    vi.stubEnv('SEED_TOKEN', 'valid-secret-token')
    
    const { GET } = await import('../route')
    
    const mockRequest = new NextRequest('http://localhost/api/admin/seed', {
      method: 'GET',
      headers: { 'x-seed-token': 'wrong-token' }
    })
    
    const response = await GET(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toContain('invalid or missing SEED_TOKEN')
  })
})
