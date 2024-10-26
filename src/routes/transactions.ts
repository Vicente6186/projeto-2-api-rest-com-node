import { database } from '@database/knexfile'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import sessionIdMiddleware from '@middlewares/index'

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const schema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = schema.parse(request.body)

    let { session_id } = request.cookies

    if (!session_id) session_id = randomUUID()
    reply.cookie('session_id', session_id, {
      path: '/transactions',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    await database('transactions').insert({
      id: randomUUID(),
      session_id,
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    reply.status(201).send()
  })

  app.get('/', { preHandler: sessionIdMiddleware }, async request => {
    const { session_id } = request.cookies

    const transactions = await database('transactions')
      .select()
      .where('session_id', session_id)

    return { transactions }
  })

  app.get('/:id', { preHandler: sessionIdMiddleware }, async request => {
    const { session_id } = request.cookies

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const transaction = await database('transactions')
      .where({ id, session_id })
      .first()

    return { transaction }
  })

  app.get('/summary', { preHandler: sessionIdMiddleware }, async request => {
    const { session_id } = request.cookies

    const summary = await database('transactions')
      .sum('amount', { as: 'amount' })
      .where('session_id', session_id)
      .first()

    return { summary }
  })
}
