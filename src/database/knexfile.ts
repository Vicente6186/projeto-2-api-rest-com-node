import { env } from '../env/index'
import knex from 'knex'
import { resolve } from 'node:path'

const config = {
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, env.DATABASE_URL),
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './migrations',
  },
}

const database = knex(config)

export { database }
export default config
