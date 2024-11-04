import { PrismaClient } from '@prisma/client/index.js';
import { Static } from '@sinclair/typebox';
import DataLoader from 'dataloader';
import { profileSchema } from '../../profiles/schemas.js';
import { postSchema } from '../../posts/schemas.js';
import { userSchema } from '../../users/schemas.js';
import { memberTypeSchema } from '../../member-types/schemas.js';

export type ProfileLoader = Static<typeof profileSchema>;
export type PostLoader = Static<typeof postSchema>;
export type subscribeUserLoader = Static<typeof userSchema>;
export type memberTypeLoader = Static<typeof memberTypeSchema>;

export interface GraphQLContext {
  prisma: PrismaClient;
  loaders: Loaders;
}

export type ContextFunction = () => GraphQLContext;

export interface Loaders {
  profileLoader: DataLoader<string, ProfileLoader, string>;
  postsLoader: DataLoader<string, PostLoader, string>;
  userSubscribedToLoader: DataLoader<string, subscribeUserLoader, string>;
  subscribedToUserLoader: DataLoader<string, subscribeUserLoader, string>;
  memberTypeLoader: DataLoader<string, memberTypeLoader, string>;
  userLoader: DataLoader<string, subscribeUserLoader, string>;
}
