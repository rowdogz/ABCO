import type { 
  ProductRepository, 
  StockRepository, 
  OrderRepository, 
  DepoRepository,
  MetricsRepository
} from '@/lib/domain/repository'
import type { 
  Product, 
  DepotStock, 
  Order, 
  Depo, 
  DashboardMetrics 
} from '@/lib/domain/types'
import { 
  validateProducts, 
  validateProduct, 
  validateDepotStocks, 
  validateOrders, 
  validateDepos,
  validateDashboardMetrics
} from '@/lib/domain/types'
import { mockProducts, mockStockLevels, mockOrders, mockDepos, mockStockChecks } from './data'

const productState = [...mockProducts]

export class MockProductRepository implements ProductRepository {
  async fetchAll(): Promise<Product[]> {
    return validateProducts(productState)
  }

  async fetchById(id: string): Promise<Product | null> {
    const product = productState.find(p => p.id === id)
    if (!product) return null
    return validateProduct(product)
  }

  async search(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase()
    const results = productState.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.sku.toLowerCase().includes(lowerQuery)
    )
    return validateProducts(results)
  }

  async fetchPendingApprovals(): Promise<Product[]> {
    const pending = productState.filter(p => p.priceApprovalStatus === 'Pending')
    return validateProducts(pending)
  }

  async approvePrice(productId: string, approvedPrice: number): Promise<Product> {
    const index = productState.findIndex(p => p.id === productId)
    if (index === -1) {
      throw new Error(`Product not found: ${productId}`)
    }
    
    productState[index] = {
      ...productState[index],
      priceApprovalStatus: 'Approved',
      approvedPrice,
      lastUpdated: new Date().toISOString()
    }
    
    return validateProduct(productState[index])
  }

  async rejectPrice(productId: string, reason?: string): Promise<Product> {
    const index = productState.findIndex(p => p.id === productId)
    if (index === -1) {
      throw new Error(`Product not found: ${productId}`)
    }
    
    productState[index] = {
      ...productState[index],
      priceApprovalStatus: 'Rejected',
      rejectionReason: reason,
      lastUpdated: new Date().toISOString()
    }
    
    return validateProduct(productState[index])
  }
}

export class MockStockRepository implements StockRepository {
  async fetchForProduct(productId: string): Promise<DepotStock[]> {
    const stocks = mockStockLevels.filter(s => s.productId === productId)
    return validateDepotStocks(stocks)
  }

  async fetchLowStockAlerts(): Promise<DepotStock[]> {
    const lowStock = mockStockLevels.filter(s => 
      s.minStock !== undefined && s.quantity < s.minStock
    )
    return validateDepotStocks(lowStock)
  }
}

export class MockOrderRepository implements OrderRepository {
  async fetchAll(depoId?: string): Promise<Order[]> {
    let orders = mockOrders
    if (depoId) {
      orders = orders.filter(o => o.depoId === depoId)
    }
    return validateOrders(orders)
  }

  async fetchForProduct(productId: string): Promise<Order[]> {
    const orders = mockOrders.filter(o => 
      o.lineItems.some(li => li.productId === productId)
    )
    return validateOrders(orders)
  }
}

export class MockDepoRepository implements DepoRepository {
  async fetchAll(): Promise<Depo[]> {
    return validateDepos(mockDepos)
  }
}

export class MockMetricsRepository implements MetricsRepository {
  async fetchDashboardMetrics(): Promise<DashboardMetrics> {
    const pendingProducts = productState.filter(p => p.priceApprovalStatus === 'Pending')
    const lowStockItems = mockStockLevels.filter(s => 
      s.minStock !== undefined && s.quantity < s.minStock
    )
    
    const varianceCost = mockStockChecks.reduce((total, check) => {
      return total + check.lines.reduce((checkTotal, line) => {
        const missing = line.expectedQty - line.countedQty
        return checkTotal + (missing > 0 ? missing * line.unitCost : 0)
      }, 0)
    }, 0)
    
    const metrics = {
      pendingPriceApprovals: pendingProducts.length,
      lowStockAlerts: lowStockItems.length,
      outstandingOrdersCount: mockOrders.length,
      stockCheckVarianceCost: Math.round(varianceCost * 100) / 100
    }
    
    return validateDashboardMetrics(metrics)
  }
}
