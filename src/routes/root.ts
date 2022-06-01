import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/healthcheck', async function (request, reply) {
    return { ok: true }
  })
}

export default root;
