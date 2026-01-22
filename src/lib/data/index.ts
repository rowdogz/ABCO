import type { 
  ProductRepository, 
  StockRepository, 
  OrderRepository, 
  DepoRepository,
  MetricsRepository,
  DataRepositories
} from '@/lib/domain/repository'
import { 
  MockProductRepository, 
  MockStockRepository, 
  MockOrderRepository, 
  MockDepoRepository,
  MockMetricsRepository
} from './mock'
import { 
  Profit4ProductRepository, 
  Profit4StockRepository, 
  Profit4OrderRepository, 
  Profit4DepoRepository,
  Profit4MetricsRepository
} from './profit4'

export type DataBackend = 'mock' | 'profit4'

function getDataBackend(): DataBackend {
  const backend = process.env.DATA_BACKEND || 'mock'
  if (backend !== 'mock' && backend !== 'profit4') {
    console.warn(`Invalid DATA_BACKEND value: ${backend}. Falling back to 'mock'.`)
    return 'mock'
  }
  return backend
}

function createProductRepository(backend: DataBackend): ProductRepository {
  switch (backend) {
    case 'profit4':
      return new Profit4ProductRepository()
    case 'mock':
    default:
      return new MockProductRepository()
  }
}

function createStockRepository(backend: DataBackend): StockRepository {
  switch (backend) {
    case 'profit4':
      return new Profit4StockRepository()
    case 'mock':
    default:
      return new MockStockRepository()
  }
}

function createOrderRepository(backend: DataBackend): OrderRepository {
  switch (backend) {
    case 'profit4':
      return new Profit4OrderRepository()
    case 'mock':
    default:
      return new MockOrderRepository()
  }
}

function createDepoRepository(backend: DataBackend): DepoRepository {
  switch (backend) {
    case 'profit4':
      return new Profit4DepoRepository()
    case 'mock':
    default:
      return new MockDepoRepository()
  }
}

function createMetricsRepository(backend: DataBackend): MetricsRepository {
  switch (backend) {
    case 'profit4':
      return new Profit4MetricsRepository()
    case 'mock':
    default:
      return new MockMetricsRepository()
  }
}

let repositoriesInstance: DataRepositories | null = null

export function getRepositories(): DataRepositories {
  if (!repositoriesInstance) {
    const backend = getDataBackend()
    repositoriesInstance = {
      products: createProductRepository(backend),
      stock: createStockRepository(backend),
      orders: createOrderRepository(backend),
      depos: createDepoRepository(backend),
      stockChecks: null as never,
      metrics: createMetricsRepository(backend)
    }
  }
  return repositoriesInstance
}

export function getProductRepository(): ProductRepository {
  return getRepositories().products
}

export function getStockRepository(): StockRepository {
  return getRepositories().stock
}

export function getOrderRepository(): OrderRepository {
  return getRepositories().orders
}

export function getDepoRepository(): DepoRepository {
  return getRepositories().depos
}

export function getMetricsRepository(): MetricsRepository {
  return getRepositories().metrics
}

export { type DataRepositories } from '@/lib/domain/repository'
