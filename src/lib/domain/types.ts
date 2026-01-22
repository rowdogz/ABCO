import { z } from 'zod'

export const DepoSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string()
})

export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().optional(),
  currentPrice: z.number(),
  proposedPrice: z.number().optional(),
  priceApprovalStatus: z.enum(['Pending', 'Approved', 'Rejected']),
  approvedPrice: z.number().optional(),
  rejectionReason: z.string().optional(),
  lastUpdated: z.string(),
  depos: z.array(z.string()),
  minStock: z.number().optional(),
  maxStock: z.number().optional(),
  unitCost: z.number(),
  category: z.string().optional()
})

export const DepotStockSchema = z.object({
  productId: z.string(),
  depoId: z.string(),
  depoName: z.string(),
  locationId: z.string().optional(),
  locationName: z.string().optional(),
  quantity: z.number(),
  minStock: z.number(),
  maxStock: z.number()
})

export const OrderLineItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  sku: z.string(),
  quantity: z.number(),
  unitPrice: z.number()
})

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerName: z.string(),
  depoId: z.string(),
  depoName: z.string(),
  expectedDeliveryDate: z.string(),
  status: z.string(),
  createdAt: z.string(),
  lineItems: z.array(OrderLineItemSchema)
})

export const StockCheckLineSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string().nullable(),
  expectedQty: z.number(),
  countedQty: z.number(),
  unitCost: z.number()
})

export const StockCheckSchema = z.object({
  id: z.string(),
  depoId: z.string(),
  depoName: z.string(),
  createdAt: z.string(),
  lines: z.array(StockCheckLineSchema)
})

export const DashboardMetricsSchema = z.object({
  pendingPriceApprovals: z.number(),
  lowStockAlerts: z.number(),
  outstandingOrdersCount: z.number(),
  stockCheckVarianceCost: z.number()
})

export type Depo = z.infer<typeof DepoSchema>
export type Product = z.infer<typeof ProductSchema>
export type DepotStock = z.infer<typeof DepotStockSchema>
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>
export type Order = z.infer<typeof OrderSchema>
export type StockCheckLine = z.infer<typeof StockCheckLineSchema>
export type StockCheck = z.infer<typeof StockCheckSchema>
export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>

export function validateProduct(data: unknown): Product {
  return ProductSchema.parse(data)
}

export function validateProducts(data: unknown): Product[] {
  return z.array(ProductSchema).parse(data)
}

export function validateDepo(data: unknown): Depo {
  return DepoSchema.parse(data)
}

export function validateDepos(data: unknown): Depo[] {
  return z.array(DepoSchema).parse(data)
}

export function validateDepotStock(data: unknown): DepotStock {
  return DepotStockSchema.parse(data)
}

export function validateDepotStocks(data: unknown): DepotStock[] {
  return z.array(DepotStockSchema).parse(data)
}

export function validateOrder(data: unknown): Order {
  return OrderSchema.parse(data)
}

export function validateOrders(data: unknown): Order[] {
  return z.array(OrderSchema).parse(data)
}

export function validateStockCheck(data: unknown): StockCheck {
  return StockCheckSchema.parse(data)
}

export function validateStockChecks(data: unknown): StockCheck[] {
  return z.array(StockCheckSchema).parse(data)
}

export function validateDashboardMetrics(data: unknown): DashboardMetrics {
  return DashboardMetricsSchema.parse(data)
}
