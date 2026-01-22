import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Repository Factory', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  describe('DATA_BACKEND=mock', () => {
    it('returns mock implementations when DATA_BACKEND is mock', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getRepositories } = await import('../index')
      const repos = getRepositories()
      
      expect(repos.products).toBeDefined()
      expect(repos.stock).toBeDefined()
      expect(repos.orders).toBeDefined()
      expect(repos.depos).toBeDefined()
      expect(repos.metrics).toBeDefined()
    })

    it('mock ProductRepository.fetchAll returns products', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getProductRepository } = await import('../index')
      const products = await getProductRepository().fetchAll()
      
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
      expect(products[0]).toHaveProperty('id')
      expect(products[0]).toHaveProperty('sku')
      expect(products[0]).toHaveProperty('name')
    })

    it('mock ProductRepository.fetchPendingApprovals returns only pending products', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getProductRepository } = await import('../index')
      const pending = await getProductRepository().fetchPendingApprovals()
      
      expect(Array.isArray(pending)).toBe(true)
      pending.forEach(product => {
        expect(product.priceApprovalStatus).toBe('Pending')
      })
    })

    it('mock StockRepository.fetchLowStockAlerts returns low stock items', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getStockRepository } = await import('../index')
      const lowStock = await getStockRepository().fetchLowStockAlerts()
      
      expect(Array.isArray(lowStock)).toBe(true)
      lowStock.forEach(stock => {
        expect(stock.quantity).toBeLessThan(stock.minStock)
      })
    })
  })

  describe('DATA_BACKEND=profit4', () => {
    it('Profit4ProductRepository.fetchAll throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getProductRepository } = await import('../index')
      
      await expect(getProductRepository().fetchAll()).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4ProductRepository.fetchById throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getProductRepository } = await import('../index')
      
      await expect(getProductRepository().fetchById('test-id')).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4ProductRepository.search throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getProductRepository } = await import('../index')
      
      await expect(getProductRepository().search('test')).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4ProductRepository.approvePrice throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getProductRepository } = await import('../index')
      
      await expect(getProductRepository().approvePrice('test-id', 100)).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4ProductRepository.rejectPrice throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getProductRepository } = await import('../index')
      
      await expect(getProductRepository().rejectPrice('test-id', 'reason')).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4StockRepository.fetchForProduct throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getStockRepository } = await import('../index')
      
      await expect(getStockRepository().fetchForProduct('test-id')).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4StockRepository.fetchLowStockAlerts throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getStockRepository } = await import('../index')
      
      await expect(getStockRepository().fetchLowStockAlerts()).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4OrderRepository.fetchAll throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getOrderRepository } = await import('../index')
      
      await expect(getOrderRepository().fetchAll()).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4OrderRepository.fetchForProduct throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getOrderRepository } = await import('../index')
      
      await expect(getOrderRepository().fetchForProduct('test-id')).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4DepoRepository.fetchAll throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getDepoRepository } = await import('../index')
      
      await expect(getDepoRepository().fetchAll()).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })

    it('Profit4MetricsRepository.fetchDashboardMetrics throws not configured error', async () => {
      vi.stubEnv('DATA_BACKEND', 'profit4')
      
      const { getMetricsRepository } = await import('../index')
      
      await expect(getMetricsRepository().fetchDashboardMetrics()).rejects.toThrow(
        'Profit4 GraphQL backend is not configured'
      )
    })
  })

  describe('DATA_BACKEND defaults', () => {
    it('defaults to mock when DATA_BACKEND is not set', async () => {
      vi.stubEnv('DATA_BACKEND', '')
      
      const { getProductRepository } = await import('../index')
      const products = await getProductRepository().fetchAll()
      
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })

    it('defaults to mock when DATA_BACKEND is invalid', async () => {
      vi.stubEnv('DATA_BACKEND', 'invalid-backend')
      
      const { getProductRepository } = await import('../index')
      const products = await getProductRepository().fetchAll()
      
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })
  })
})
