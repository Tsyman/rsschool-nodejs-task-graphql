import { GraphQLNonNull, GraphQLString } from 'graphql';
import { PostType, ProfileType, UserType } from '../types/query.js';
import { GraphQLContext } from '../types/common.js';
import {
  changePostType,
  changeProfileType,
  changeUserType,
  CreatePostInput,
  CreateUserInput,
  CreateProfileInput,
} from '../types/mutation.js';
import { UUIDType } from '../types/uuid.js';

const createUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    dto: {
      type: new GraphQLNonNull(CreateUserInput),
    },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.prisma.user.create({
      data: args.dto,
    });
  },
};

const createPost = {
  type: new GraphQLNonNull(PostType),
  args: {
    dto: {
      type: new GraphQLNonNull(CreatePostInput),
    },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.prisma.post.create({
      data: args.dto,
    });
  },
};

const createProfile = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    dto: {
      type: new GraphQLNonNull(CreateProfileInput),
    },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.prisma.profile.create({
      data: args.dto,
    });
  },
};

const changeUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: {
      type: new GraphQLNonNull(changeUserType),
    },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.prisma.user.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

const changePost = {
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: {
      type: new GraphQLNonNull(changePostType),
    },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.prisma.post.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

const changeProfile = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: {
      type: new GraphQLNonNull(changeProfileType),
    },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.prisma.profile.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

const deleteUser = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    await context.prisma.user.delete({
      where: { id: args.id },
    });
    return 'The user has been deleted successfully';
  },
};

const deletePost = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    await context.prisma.post.delete({
      where: { id: args.id },
    });
    return 'The post has been deleted successfully';
  },
};

const deleteProfile = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    await context.prisma.profile.delete({
      where: { id: args.id },
    });
    return 'The profile has been deleted successfully';
  },
};

const createSubscribe = {
  type: new GraphQLNonNull(UserType),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.prisma.user.update({
      where: { id: args.userId },
      data: {
        userSubscribedTo: {
          create: {
            authorId: args.authorId,
          },
        },
      },
    });
  },
};

const deleteSubscribe = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    await context.prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: args.userId,
          authorId: args.authorId,
        },
      },
    });
    return 'The subscribe has been deleted successfully';
  },
};

export const mutationFields = {
  createUser: { ...createUser },
  createPost: { ...createPost },
  createProfile: { ...createProfile },
  changeUser: { ...changeUser },
  changePost: { ...changePost },
  changeProfile: { ...changeProfile },
  deleteUser: { ...deleteUser },
  deletePost: { ...deletePost },
  deleteProfile: { ...deleteProfile },
  subscribeTo: { ...createSubscribe },
  unsubscribeFrom: { ...deleteSubscribe },
};
