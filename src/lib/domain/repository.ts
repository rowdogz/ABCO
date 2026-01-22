import type { 
  Product, 
  DepotStock, 
  Order, 
  Depo, 
  StockCheck, 
  StockCheckLine,
  DashboardMetrics 
} from './types'

export interface ProductRepository {
  fetchAll(): Promise<Product[]>
  fetchById(id: string): Promise<Product | null>
  search(query: string): Promise<Product[]>
  fetchPendingApprovals(): Promise<Product[]>
  approvePrice(productId: string, approvedPrice: number): Promise<Product>
  rejectPrice(productId: string, reason?: string): Promise<Product>
}

export interface StockRepository {
  fetchForProduct(productId: string): Promise<DepotStock[]>
  fetchLowStockAlerts(): Promise<DepotStock[]>
}

export interface OrderRepository {
  fetchAll(depoId?: string): Promise<Order[]>
  fetchForProduct(productId: string): Promise<Order[]>
}

export interface DepoRepository {
  fetchAll(): Promise<Depo[]>
}

export interface StockCheckRepository {
  fetchAll(): Promise<StockCheck[]>
  create(depoId: string, userId: string): Promise<StockCheck>
  addLine(
    stockCheckId: string, 
    line: Omit<StockCheckLine, 'id'>
  ): Promise<StockCheckLine>
  removeLine(stockCheckId: string, lineId: string): Promise<void>
}

export interface MetricsRepository {
  fetchDashboardMetrics(): Promise<DashboardMetrics>
}

export interface DataRepositories {
  products: ProductRepository
  stock: StockRepository
  orders: OrderRepository
  depos: DepoRepository
  stockChecks: StockCheckRepository
  metrics: MetricsRepository
}
