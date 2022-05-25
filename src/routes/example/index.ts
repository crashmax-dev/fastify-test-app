import { FastifyPluginAsync } from "fastify"

const example: FastifyPluginAsync<{ prefix: string }> = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { example: fastify.someSupport(), prefix: opts.prefix }
  })
}

export default example;
