import { FastifyReply, FastifyRequest } from 'fastify'

export default async function sessionIdMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { session_id } = request.cookies
  if (!session_id) return reply.status(401).send()
}
