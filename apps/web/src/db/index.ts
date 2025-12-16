import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Please define it to connect to Postgres.')
}

const isLocalConnection =
  connectionString.includes('localhost') || connectionString.includes('127.0.0.1')

const client = postgres(connectionString, {
  max: 1,
  prepare: false,
  ssl: isLocalConnection ? undefined : 'require',
})
export const db = drizzle(client, { schema })
export * from './schema'
