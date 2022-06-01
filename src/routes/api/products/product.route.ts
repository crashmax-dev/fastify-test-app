import { $ref } from './product.schema'
import { createProductHandler, getProductsHandler } from './product.controller'
import type { FastifyInstance } from 'fastify'

async function productRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('productResponseSchema')
        }
      }
    },
    createProductHandler
  )

  server.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('productsResponseSchema')
        }
      }
    },
    getProductsHandler
  )
}

export default productRoutes
