import { GraphQLClient } from 'graphql-request'

const PROFIT4_URL = process.env.PROFIT4_GRAPHQL_URL || 'https://abco.profit4.co.uk/api/graphql'
const API_KEY = process.env.PROFIT4_API_KEY || ''

export const graphqlClient = new GraphQLClient(PROFIT4_URL, {
  headers: {
    ...(API_KEY && { Authorization: `Bearer ${API_KEY}` })
  }
})

export async function executeGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  try {
    return await graphqlClient.request<T>(query, variables)
  } catch (error) {
    console.error('GraphQL Error:', error)
    throw error
  }
}
