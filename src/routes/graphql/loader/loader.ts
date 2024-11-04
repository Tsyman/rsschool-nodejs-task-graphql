import { PrismaClient} from '@prisma/client';
import { batchPosts, batchProfile, batchMember, batchUser } from './batch.js';

export const createLoaders = (prisma: PrismaClient) => ({
  postsLoader: batchPosts(prisma),
  profileLoader: batchProfile(prisma),
  memberLoader: batchMember(prisma),
  userLoader: batchUser(prisma),
});