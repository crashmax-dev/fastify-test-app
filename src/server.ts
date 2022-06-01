import 'dotenv/config'
import path from 'path'
import Fastify from 'fastify'
import fastifyJWT from '@fastify/jwt'
import fastifyAutoload from '@fastify/autoload'
import fastifySwagger from 'fastify-swagger'
import { withRefResolver } from 'fastify-zod'
import { version } from '../package.json'
import { userSchemas } from './routes/api/users/user.schema'
import { productSchemas } from './routes/api/products/product.schema'
import type { JWT } from '@fastify/jwt'
import type { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }

  interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number
      email: string
      name: string
    }
  }
}

function buildServer() {
  const fastify = Fastify()

  fastify.register(fastifyJWT, {
    secret: "some_secret_jwt_token"
  })

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        return reply.send(err)
      }
    }
  )

  fastify.addHook(
    'preHandler',
    (request, reply, next) => {
      request.jwt = fastify.jwt
      return next()
    }
  )

  for (const schema of [...userSchemas, ...productSchemas]) {
    fastify.addSchema(schema)
  }

  fastify.register(fastifySwagger, withRefResolver({
    routePrefix: '/docs',
    exposeRoute: true,
    staticCSP: true,
    openapi: {
      info: {
        title: 'Fastify API',
        description: 'API for some products',
        version
      }
    }
  }))

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
    indexPattern: /.*(route).ts/,
    ignorePattern: /.*(controller|service|schema|test).ts/
  })

  return fastify
}

export default buildServer
