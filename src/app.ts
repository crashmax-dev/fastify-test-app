import buildServer from './server'

const fastify = buildServer()

async function bootstrap() {
  try {
    const address = await fastify.listen({
      host: 'localhost',
      port: 3000
    })

    console.log(`Server ready at ${address}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

bootstrap()
