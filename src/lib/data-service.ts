import type { Product, DepotStock, Order, Depo, DashboardMetrics, AuditLog, AuditActionType } from '@/lib/domain/types'
import type { AuditLogFilters } from '@/lib/domain/repository'
import { 
  getProductRepository, 
  getStockRepository, 
  getOrderRepository, 
  getDepoRepository,
  getMetricsRepository,
  getAuditLogRepository
} from '@/lib/data'

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  return getMetricsRepository().fetchDashboardMetrics()
}

export async function fetchProducts(): Promise<Product[]> {
  return getProductRepository().fetchAll()
}

export async function fetchProductById(id: string): Promise<Product | null> {
  return getProductRepository().fetchById(id)
}

export async function searchProducts(query: string): Promise<Product[]> {
  return getProductRepository().search(query)
}

export async function fetchPendingApprovals(): Promise<Product[]> {
  return getProductRepository().fetchPendingApprovals()
}

export async function fetchStockForProduct(productId: string): Promise<DepotStock[]> {
  return getStockRepository().fetchForProduct(productId)
}

export async function fetchLowStockAlerts(): Promise<DepotStock[]> {
  return getStockRepository().fetchLowStockAlerts()
}

export async function fetchOrders(depoId?: string): Promise<Order[]> {
  return getOrderRepository().fetchAll(depoId)
}

export async function fetchOrdersForProduct(productId: string): Promise<Order[]> {
  return getOrderRepository().fetchForProduct(productId)
}

export async function fetchDepos(): Promise<Depo[]> {
  return getDepoRepository().fetchAll()
}

export async function approveProductPrice(
  productId: string, 
  approvedPrice: number
): Promise<Product> {
  return getProductRepository().approvePrice(productId, approvedPrice)
}

export async function rejectProductPrice(
  productId: string, 
  reason?: string
): Promise<Product> {
  return getProductRepository().rejectPrice(productId, reason)
}

export async function executeRawGraphQL(query: string): Promise<unknown> {
  const { graphqlClient } = await import('./graphql-client')
  return graphqlClient.request(query)
}

export async function createAuditLog(
  entry: Omit<AuditLog, 'id' | 'createdAt'>
): Promise<AuditLog> {
  return getAuditLogRepository().create(entry)
}

export async function fetchAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]> {
  return getAuditLogRepository().fetchAll(filters)
}

export type { Product, DepotStock, Order, Depo, DashboardMetrics, AuditLog, AuditActionType }
export type { AuditLogFilters }
