import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockProducts, mockStockLevels, mockOrders, mockStockChecks } from '../mock/data'

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

  describe('Metrics derivation from seeded data', () => {
    it('pending approvals count matches seeded data', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getMetricsRepository } = await import('../index')
      const metrics = await getMetricsRepository().fetchDashboardMetrics()
      
      const expectedPending = mockProducts.filter(p => p.priceApprovalStatus === 'Pending').length
      expect(metrics.pendingPriceApprovals).toBe(expectedPending)
      expect(expectedPending).toBeGreaterThanOrEqual(10)
    })

    it('low stock count matches seeded data rules', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getMetricsRepository } = await import('../index')
      const metrics = await getMetricsRepository().fetchDashboardMetrics()
      
      const expectedLowStock = mockStockLevels.filter(s => 
        s.minStock !== undefined && s.quantity < s.minStock
      ).length
      expect(metrics.lowStockAlerts).toBe(expectedLowStock)
      expect(expectedLowStock).toBeGreaterThanOrEqual(8)
    })

    it('outstanding orders count matches seeded data', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getMetricsRepository } = await import('../index')
      const metrics = await getMetricsRepository().fetchDashboardMetrics()
      
      expect(metrics.outstandingOrdersCount).toBe(mockOrders.length)
      expect(mockOrders.length).toBeGreaterThanOrEqual(12)
    })

    it('variance cost calculation matches seeded stock checks', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getMetricsRepository } = await import('../index')
      const metrics = await getMetricsRepository().fetchDashboardMetrics()
      
      const expectedVarianceCost = mockStockChecks.reduce((total, check) => {
        return total + check.lines.reduce((checkTotal, line) => {
          const missing = line.expectedQty - line.countedQty
          return checkTotal + (missing > 0 ? missing * line.unitCost : 0)
        }, 0)
      }, 0)
      
      expect(metrics.stockCheckVarianceCost).toBe(Math.round(expectedVarianceCost * 100) / 100)
      expect(metrics.stockCheckVarianceCost).toBeGreaterThan(0)
    })
  })

  describe('Mock data requirements', () => {
    it('has at least 40 products', () => {
      expect(mockProducts.length).toBeGreaterThanOrEqual(40)
    })

    it('has at least 10 products in Pending status', () => {
      const pending = mockProducts.filter(p => p.priceApprovalStatus === 'Pending')
      expect(pending.length).toBeGreaterThanOrEqual(10)
    })

    it('has at least 8 stock items below min stock', () => {
      const lowStock = mockStockLevels.filter(s => 
        s.minStock !== undefined && s.quantity < s.minStock
      )
      expect(lowStock.length).toBeGreaterThanOrEqual(8)
    })

    it('has at least 4 depots', async () => {
      vi.stubEnv('DATA_BACKEND', 'mock')
      
      const { getDepoRepository } = await import('../index')
      const depos = await getDepoRepository().fetchAll()
      
      expect(depos.length).toBeGreaterThanOrEqual(4)
    })

    it('has at least 12 orders', () => {
      expect(mockOrders.length).toBeGreaterThanOrEqual(12)
    })

    it('has at least 3 stock checks with variance', () => {
      expect(mockStockChecks.length).toBeGreaterThanOrEqual(3)
      mockStockChecks.forEach(check => {
        const variance = check.lines.reduce((total, line) => {
          return total + Math.abs(line.expectedQty - line.countedQty)
        }, 0)
        expect(variance).toBeGreaterThan(0)
      })
    })

    it('includes edge cases: discontinued product', () => {
      const discontinued = mockProducts.filter(p => p.discontinued === true)
      expect(discontinued.length).toBeGreaterThanOrEqual(1)
    })

    it('includes edge cases: product without bin location', () => {
      const noBin = mockProducts.filter(p => p.binLocation === undefined)
      expect(noBin.length).toBeGreaterThanOrEqual(1)
    })

    it('includes edge cases: product without unit cost', () => {
      const noCost = mockProducts.filter(p => p.unitCost === undefined)
      expect(noCost.length).toBeGreaterThanOrEqual(1)
    })

    it('includes edge cases: zero stock product', () => {
      const zeroStock = mockStockLevels.filter(s => s.quantity === 0)
      expect(zeroStock.length).toBeGreaterThanOrEqual(1)
    })

    it('includes partial delivery orders', () => {
      const partialOrders = mockOrders.filter(o => 
        o.lineItems.some(li => li.receivedQty !== undefined && li.receivedQty < li.quantity)
      )
      expect(partialOrders.length).toBeGreaterThanOrEqual(1)
    })

    it('includes stock levels with missing min/max', () => {
      const missingMinMax = mockStockLevels.filter(s => 
        s.minStock === undefined || s.maxStock === undefined
      )
      expect(missingMinMax.length).toBeGreaterThanOrEqual(1)
    })
  })
})
