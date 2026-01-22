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

const NOT_CONFIGURED_ERROR = 'Profit4 GraphQL backend is not configured. Please set up the PROFIT4_GRAPHQL_URL and PROFIT4_API_KEY environment variables.'

export class Profit4ProductRepository implements ProductRepository {
  async fetchAll(): Promise<Product[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }

  async fetchById(_id: string): Promise<Product | null> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }

  async search(_query: string): Promise<Product[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }

  async fetchPendingApprovals(): Promise<Product[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }

  async approvePrice(_productId: string, _approvedPrice: number): Promise<Product> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }

  async rejectPrice(_productId: string, _reason?: string): Promise<Product> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }
}

export class Profit4StockRepository implements StockRepository {
  async fetchForProduct(_productId: string): Promise<DepotStock[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }

  async fetchLowStockAlerts(): Promise<DepotStock[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }
}

export class Profit4OrderRepository implements OrderRepository {
  async fetchAll(_depoId?: string): Promise<Order[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }

  async fetchForProduct(_productId: string): Promise<Order[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }
}

export class Profit4DepoRepository implements DepoRepository {
  async fetchAll(): Promise<Depo[]> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }
}

export class Profit4MetricsRepository implements MetricsRepository {
  async fetchDashboardMetrics(): Promise<DashboardMetrics> {
    throw new Error(NOT_CONFIGURED_ERROR)
  }
}
