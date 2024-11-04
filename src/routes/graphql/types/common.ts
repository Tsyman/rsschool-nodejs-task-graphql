import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType } from 'graphql/index.js';
import { createLoaders } from '../loader/loader.js';

export type GraphQLContext = {
  db: PrismaClient;
  dataloaders: ReturnType<typeof createLoaders>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GraphQLObjectTypeWithContext = GraphQLObjectType<any, GraphQLContext>;
