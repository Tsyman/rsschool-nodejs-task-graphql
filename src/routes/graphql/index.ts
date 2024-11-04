import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { execute, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createLoaders } from './loader/loader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      try {
        const document = parse(query);
        const validationErrors = validate(schema, document, [depthLimit(5)]);

        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        const loaders = createLoaders(fastify.prisma);
        const result = await execute({
          schema,
          document,
          variableValues: variables,
          contextValue: { prisma: fastify.prisma, loaders },
        });

        return result;
      } catch (error) {
        return { errors: [error] };
      }
    },
  });
};

export default plugin;
