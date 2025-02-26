import fastify from 'fastify'
import 'dotenv/config'
import { transactionRoutes } from '../routes/transactions'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)

app.register(transactionRoutes, {
  prefix: 'transactions',
})

export default app
