export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  currentPrice: number
  proposedPrice?: number
  priceApprovalStatus: 'Pending' | 'Approved' | 'Rejected'
  approvedPrice?: number
  rejectionReason?: string
  lastUpdated: string
  depos: string[]
  minStock?: number
  maxStock?: number
  unitCost: number
  category?: string
}

export interface StockLevel {
  productId: string
  depoId: string
  depoName: string
  locationId?: string
  locationName?: string
  quantity: number
  minStock: number
  maxStock: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  depoId: string
  depoName: string
  expectedDeliveryDate: string
  status: string
  createdAt: string
  lineItems: OrderLineItem[]
}

export interface OrderLineItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
}

export interface Depo {
  id: string
  name: string
  code: string
}

export interface DashboardMetrics {
  pendingPriceApprovals: number
  lowStockAlerts: number
  outstandingOrdersCount: number
  stockCheckVarianceCost: number
}
