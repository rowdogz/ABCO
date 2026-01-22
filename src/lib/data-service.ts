import { Product, StockLevel, Order, Depo, DashboardMetrics } from '@/types/graphql'
import * as mockData from './mock-data'

const USE_MOCK_DATA = true

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  if (USE_MOCK_DATA) {
    return mockData.getDashboardMetrics()
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchProducts(): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    return mockData.mockProducts
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    return mockData.getProductById(id) || null
  }
  throw new Error('Real GraphQL not implemented')
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    return mockData.searchProducts(query)
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchPendingApprovals(): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    return mockData.getPendingApprovals()
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchStockForProduct(productId: string): Promise<StockLevel[]> {
  if (USE_MOCK_DATA) {
    return mockData.getStockForProduct(productId)
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchLowStockAlerts(): Promise<StockLevel[]> {
  if (USE_MOCK_DATA) {
    return mockData.getLowStockAlerts()
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchOrders(depoId?: string): Promise<Order[]> {
  if (USE_MOCK_DATA) {
    return mockData.getOrdersByDepo(depoId)
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchOrdersForProduct(productId: string): Promise<Order[]> {
  if (USE_MOCK_DATA) {
    return mockData.getOrdersForProduct(productId)
  }
  throw new Error('Real GraphQL not implemented')
}

export async function fetchDepos(): Promise<Depo[]> {
  if (USE_MOCK_DATA) {
    return mockData.mockDepos
  }
  throw new Error('Real GraphQL not implemented')
}

export async function approveProductPrice(
  productId: string, 
  approvedPrice: number
): Promise<Product> {
  if (USE_MOCK_DATA) {
    const product = mockData.mockProducts.find(p => p.id === productId)
    if (!product) throw new Error('Product not found')
    
    product.priceApprovalStatus = 'Approved'
    product.approvedPrice = approvedPrice
    product.currentPrice = approvedPrice
    product.proposedPrice = undefined
    product.lastUpdated = new Date().toISOString()
    
    return product
  }
  throw new Error('Real GraphQL not implemented')
}

export async function rejectProductPrice(
  productId: string, 
  reason?: string
): Promise<Product> {
  if (USE_MOCK_DATA) {
    const product = mockData.mockProducts.find(p => p.id === productId)
    if (!product) throw new Error('Product not found')
    
    product.priceApprovalStatus = 'Rejected'
    product.rejectionReason = reason
    product.proposedPrice = undefined
    product.lastUpdated = new Date().toISOString()
    
    return product
  }
  throw new Error('Real GraphQL not implemented')
}

export async function executeRawGraphQL(query: string): Promise<unknown> {
  const { graphqlClient } = await import('./graphql-client')
  return graphqlClient.request(query)
}
