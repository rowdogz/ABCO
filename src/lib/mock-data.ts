import { Product, StockLevel, Order, Depo, DashboardMetrics } from '@/types/graphql'

export const mockDepos: Depo[] = [
  { id: 'depo-1', name: 'Birmingham Depot', code: 'BHM' },
  { id: 'depo-2', name: 'Manchester Depot', code: 'MAN' },
  { id: 'depo-3', name: 'London Depot', code: 'LDN' },
  { id: 'depo-4', name: 'Leeds Depot', code: 'LDS' },
]

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    sku: 'UPVC-WIN-001',
    name: 'uPVC Window Frame 1200x900',
    description: 'Standard white uPVC window frame',
    currentPrice: 145.00,
    proposedPrice: 155.00,
    priceApprovalStatus: 'Pending',
    lastUpdated: '2026-01-20T10:30:00Z',
    depos: ['depo-1', 'depo-2'],
    minStock: 50,
    maxStock: 200,
    unitCost: 95.00,
    category: 'Windows'
  },
  {
    id: 'prod-002',
    sku: 'UPVC-DOOR-001',
    name: 'uPVC Door Panel White',
    description: 'Standard white uPVC door panel',
    currentPrice: 220.00,
    proposedPrice: 235.00,
    priceApprovalStatus: 'Pending',
    lastUpdated: '2026-01-19T14:15:00Z',
    depos: ['depo-1', 'depo-3'],
    minStock: 30,
    maxStock: 100,
    unitCost: 145.00,
    category: 'Doors'
  },
  {
    id: 'prod-003',
    sku: 'SEAL-RUB-001',
    name: 'Rubber Seal Strip 10m',
    description: 'Weather seal rubber strip',
    currentPrice: 12.50,
    priceApprovalStatus: 'Approved',
    approvedPrice: 12.50,
    lastUpdated: '2026-01-15T09:00:00Z',
    depos: ['depo-1', 'depo-2', 'depo-3', 'depo-4'],
    minStock: 200,
    maxStock: 1000,
    unitCost: 6.50,
    category: 'Seals'
  },
  {
    id: 'prod-004',
    sku: 'GLASS-DG-001',
    name: 'Double Glazed Unit 600x400',
    description: 'Standard double glazed glass unit',
    currentPrice: 85.00,
    proposedPrice: 92.00,
    priceApprovalStatus: 'Pending',
    lastUpdated: '2026-01-21T16:45:00Z',
    depos: ['depo-2', 'depo-4'],
    minStock: 100,
    maxStock: 500,
    unitCost: 52.00,
    category: 'Glass'
  },
  {
    id: 'prod-005',
    sku: 'HINGE-SS-001',
    name: 'Stainless Steel Hinge Set',
    description: 'Heavy duty stainless steel hinges',
    currentPrice: 18.00,
    priceApprovalStatus: 'Approved',
    approvedPrice: 18.00,
    lastUpdated: '2026-01-10T11:20:00Z',
    depos: ['depo-1', 'depo-2', 'depo-3'],
    minStock: 500,
    maxStock: 2000,
    unitCost: 9.50,
    category: 'Hardware'
  },
  {
    id: 'prod-006',
    sku: 'LOCK-MUL-001',
    name: 'Multi-Point Lock Mechanism',
    description: 'Security multi-point locking system',
    currentPrice: 65.00,
    proposedPrice: 72.00,
    priceApprovalStatus: 'Pending',
    lastUpdated: '2026-01-22T08:00:00Z',
    depos: ['depo-1', 'depo-3'],
    minStock: 75,
    maxStock: 300,
    unitCost: 38.00,
    category: 'Hardware'
  },
  {
    id: 'prod-007',
    sku: 'SILL-ALU-001',
    name: 'Aluminium Window Sill 1500mm',
    description: 'External aluminium window sill',
    currentPrice: 32.00,
    priceApprovalStatus: 'Rejected',
    rejectionReason: 'Price increase too high',
    lastUpdated: '2026-01-18T13:30:00Z',
    depos: ['depo-2', 'depo-4'],
    minStock: 150,
    maxStock: 600,
    unitCost: 18.00,
    category: 'Sills'
  },
  {
    id: 'prod-008',
    sku: 'FOAM-EXP-001',
    name: 'Expanding Foam 750ml',
    description: 'PU expanding foam for installation',
    currentPrice: 8.50,
    proposedPrice: 9.25,
    priceApprovalStatus: 'Pending',
    lastUpdated: '2026-01-21T10:00:00Z',
    depos: ['depo-1', 'depo-2', 'depo-3', 'depo-4'],
    minStock: 300,
    maxStock: 1500,
    unitCost: 4.20,
    category: 'Consumables'
  }
]

export const mockStockLevels: StockLevel[] = [
  { productId: 'prod-001', depoId: 'depo-1', depoName: 'Birmingham Depot', quantity: 45, minStock: 50, maxStock: 200 },
  { productId: 'prod-001', depoId: 'depo-2', depoName: 'Manchester Depot', quantity: 120, minStock: 50, maxStock: 200 },
  { productId: 'prod-002', depoId: 'depo-1', depoName: 'Birmingham Depot', quantity: 25, minStock: 30, maxStock: 100 },
  { productId: 'prod-002', depoId: 'depo-3', depoName: 'London Depot', quantity: 55, minStock: 30, maxStock: 100 },
  { productId: 'prod-003', depoId: 'depo-1', depoName: 'Birmingham Depot', quantity: 180, minStock: 200, maxStock: 1000 },
  { productId: 'prod-003', depoId: 'depo-2', depoName: 'Manchester Depot', quantity: 450, minStock: 200, maxStock: 1000 },
  { productId: 'prod-003', depoId: 'depo-3', depoName: 'London Depot', quantity: 320, minStock: 200, maxStock: 1000 },
  { productId: 'prod-003', depoId: 'depo-4', depoName: 'Leeds Depot', quantity: 190, minStock: 200, maxStock: 1000 },
  { productId: 'prod-004', depoId: 'depo-2', depoName: 'Manchester Depot', quantity: 85, minStock: 100, maxStock: 500 },
  { productId: 'prod-004', depoId: 'depo-4', depoName: 'Leeds Depot', quantity: 210, minStock: 100, maxStock: 500 },
  { productId: 'prod-005', depoId: 'depo-1', depoName: 'Birmingham Depot', quantity: 850, minStock: 500, maxStock: 2000 },
  { productId: 'prod-005', depoId: 'depo-2', depoName: 'Manchester Depot', quantity: 620, minStock: 500, maxStock: 2000 },
  { productId: 'prod-005', depoId: 'depo-3', depoName: 'London Depot', quantity: 480, minStock: 500, maxStock: 2000 },
  { productId: 'prod-006', depoId: 'depo-1', depoName: 'Birmingham Depot', quantity: 65, minStock: 75, maxStock: 300 },
  { productId: 'prod-006', depoId: 'depo-3', depoName: 'London Depot', quantity: 110, minStock: 75, maxStock: 300 },
  { productId: 'prod-007', depoId: 'depo-2', depoName: 'Manchester Depot', quantity: 280, minStock: 150, maxStock: 600 },
  { productId: 'prod-007', depoId: 'depo-4', depoName: 'Leeds Depot', quantity: 145, minStock: 150, maxStock: 600 },
  { productId: 'prod-008', depoId: 'depo-1', depoName: 'Birmingham Depot', quantity: 520, minStock: 300, maxStock: 1500 },
  { productId: 'prod-008', depoId: 'depo-2', depoName: 'Manchester Depot', quantity: 280, minStock: 300, maxStock: 1500 },
  { productId: 'prod-008', depoId: 'depo-3', depoName: 'London Depot', quantity: 410, minStock: 300, maxStock: 1500 },
  { productId: 'prod-008', depoId: 'depo-4', depoName: 'Leeds Depot', quantity: 295, minStock: 300, maxStock: 1500 },
]

export const mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD-2026-0145',
    customerName: 'Eurocell Ltd',
    depoId: 'depo-1',
    depoName: 'Birmingham Depot',
    expectedDeliveryDate: '2026-01-25',
    status: 'Processing',
    createdAt: '2026-01-20T09:00:00Z',
    lineItems: [
      { id: 'li-001', productId: 'prod-001', productName: 'uPVC Window Frame 1200x900', sku: 'UPVC-WIN-001', quantity: 50, unitPrice: 145.00 },
      { id: 'li-002', productId: 'prod-005', productName: 'Stainless Steel Hinge Set', sku: 'HINGE-SS-001', quantity: 200, unitPrice: 18.00 },
    ]
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-2026-0146',
    customerName: 'Eurocell Ltd',
    depoId: 'depo-2',
    depoName: 'Manchester Depot',
    expectedDeliveryDate: '2026-01-26',
    status: 'Pending',
    createdAt: '2026-01-21T11:30:00Z',
    lineItems: [
      { id: 'li-003', productId: 'prod-004', productName: 'Double Glazed Unit 600x400', sku: 'GLASS-DG-001', quantity: 100, unitPrice: 85.00 },
    ]
  },
  {
    id: 'order-003',
    orderNumber: 'ORD-2026-0147',
    customerName: 'BuildRight Supplies',
    depoId: 'depo-3',
    depoName: 'London Depot',
    expectedDeliveryDate: '2026-01-24',
    status: 'Processing',
    createdAt: '2026-01-19T14:00:00Z',
    lineItems: [
      { id: 'li-004', productId: 'prod-002', productName: 'uPVC Door Panel White', sku: 'UPVC-DOOR-001', quantity: 25, unitPrice: 220.00 },
      { id: 'li-005', productId: 'prod-006', productName: 'Multi-Point Lock Mechanism', sku: 'LOCK-MUL-001', quantity: 25, unitPrice: 65.00 },
      { id: 'li-006', productId: 'prod-008', productName: 'Expanding Foam 750ml', sku: 'FOAM-EXP-001', quantity: 50, unitPrice: 8.50 },
    ]
  },
  {
    id: 'order-004',
    orderNumber: 'ORD-2026-0148',
    customerName: 'Window World',
    depoId: 'depo-4',
    depoName: 'Leeds Depot',
    expectedDeliveryDate: '2026-01-27',
    status: 'Confirmed',
    createdAt: '2026-01-22T08:15:00Z',
    lineItems: [
      { id: 'li-007', productId: 'prod-007', productName: 'Aluminium Window Sill 1500mm', sku: 'SILL-ALU-001', quantity: 75, unitPrice: 32.00 },
      { id: 'li-008', productId: 'prod-004', productName: 'Double Glazed Unit 600x400', sku: 'GLASS-DG-001', quantity: 50, unitPrice: 85.00 },
    ]
  },
  {
    id: 'order-005',
    orderNumber: 'ORD-2026-0149',
    customerName: 'Eurocell Ltd',
    depoId: 'depo-1',
    depoName: 'Birmingham Depot',
    expectedDeliveryDate: '2026-01-28',
    status: 'Pending',
    createdAt: '2026-01-22T10:00:00Z',
    lineItems: [
      { id: 'li-009', productId: 'prod-003', productName: 'Rubber Seal Strip 10m', sku: 'SEAL-RUB-001', quantity: 500, unitPrice: 12.50 },
    ]
  }
]

export function getDashboardMetrics(): DashboardMetrics {
  const pendingProducts = mockProducts.filter(p => p.priceApprovalStatus === 'Pending')
  const lowStockItems = mockStockLevels.filter(s => s.quantity < s.minStock)
  
  return {
    pendingPriceApprovals: pendingProducts.length,
    lowStockAlerts: lowStockItems.length,
    outstandingOrdersCount: mockOrders.length,
    stockCheckVarianceCost: 1250.75
  }
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id)
}

export function getStockForProduct(productId: string): StockLevel[] {
  return mockStockLevels.filter(s => s.productId === productId)
}

export function getOrdersForProduct(productId: string): Order[] {
  return mockOrders.filter(o => o.lineItems.some(li => li.productId === productId))
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    p.sku.toLowerCase().includes(lowerQuery)
  )
}

export function getPendingApprovals(): Product[] {
  return mockProducts.filter(p => p.priceApprovalStatus === 'Pending')
}

export function getLowStockAlerts(): StockLevel[] {
  return mockStockLevels.filter(s => s.quantity < s.minStock)
}

export function getOrdersByDepo(depoId?: string): Order[] {
  if (!depoId) return mockOrders
  return mockOrders.filter(o => o.depoId === depoId)
}
