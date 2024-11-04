import { GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { GraphQLContext } from '../types/common.js';
import {
  ChangeUserInput,
  CreateUserDto,
  CreateUserInput,
  UserType,
} from '../types/user.js';
import { UUIDType } from '../types/uuid.js';
import {
  ChangePostInput,
  CreatePostDto,
  CreatePostInput,
  PostType,
} from '../types/post.js';
import {
  ChangeProfileInput,
  CreateProfileDto,
  CreateProfileInput,
  ProfileType,
} from '../types/profile.js';
import { GraphQLBoolean } from 'graphql';

export const mutation = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      description: 'Create post',
      args: {
        dto: { type: CreatePostInput },
      },
      resolve: async (_, { dto: data }: { dto: CreatePostDto }, { db }) =>
        await db.post.create({ data }),
    },
    changePost: {
      type: PostType,
      description: 'Change post',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        _,
        { dto: data, id }: { id: string; dto: Partial<CreatePostDto> },
        { db },
      ) => {
        return db.post.update({ where: { id }, data });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      description: 'Delete post',
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }: { id: string }, { db }) => {
        await db.post.delete({ where: { id } });
        return true;
      },
    },
    createUser: {
      type: UserType,
      description: 'Create user',
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (_, { dto: data }: { dto: CreateUserDto }, { db }) =>
        await db.user.create({ data }),
    },
    changeUser: {
      type: UserType,
      description: 'Change user',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        _,
        { dto: data, id }: { id: string; dto: Partial<CreateUserDto> },
        { db },
      ) => {
        return db.user.update({ where: { id }, data });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      description: 'Delete user',
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }: { id: string }, { db }) => {
        await db.user.delete({ where: { id } });
        return true;
      },
    },
    createProfile: {
      type: ProfileType,
      description: 'Create profile',
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto: data }: { dto: CreateProfileDto }, { db }) =>
        await db.profile.create({ data }),
    },
    changeProfile: {
      type: ProfileType,
      description: 'Change profile',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        _,
        { dto: data, id }: { id: string; dto: Partial<CreateProfileDto> },
        { db },
      ) => await db.profile.update({ where: { id }, data }),
    },
    deleteProfile: {
      type: GraphQLBoolean,
      description: 'Delete profile',
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }: { id: string }, { db }) => {
        await db.profile.delete({ where: { id } });
        return true;
      },
    },
    subscribeTo: {
      type: UserType,
      description: 'Subscribe to',
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { db },
      ) => {
        return db.user.update({
          where: { id: userId },
          data: {
            userSubscribedTo: {
              create: {
                authorId,
              },
            },
          },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      description: 'Unsubscribe from',
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { db },
      ) => {
        await db.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { authorId, subscriberId: userId } },
        });
        return true;
      },
    },
  },
});
