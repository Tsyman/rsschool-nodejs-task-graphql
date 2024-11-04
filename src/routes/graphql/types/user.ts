import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { GraphQLObjectTypeWithContext } from './common.js';
import { GraphQLFloat } from 'graphql/index.js';

export type CreateUserDto = { name: string; balance: number };
type SubscribeInfo = {
  subscriberId: string;
  authorId: string;
};
type UserWithSubscribe = CreateUserDto & {
  id: string;
  userSubscribedTo?: SubscribeInfo[];
  subscribedToUser?: SubscribeInfo[];
};
export const UserType = new GraphQLObjectTypeWithContext({
  name: 'UserType',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    id: { type: new GraphQLNonNull(UUIDType) },
    profile: {
      type: ProfileType as GraphQLObjectType,
      resolve: async ({ id }: { id: string }, _, { dataloaders }) =>
        dataloaders.profileLoader.load(id),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: { id: string }, _, { dataloaders }) =>
        dataloaders.postsLoader.load(id),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source: UserWithSubscribe, _, { dataloaders }) => {
        if (!source.userSubscribedTo?.length) return [];
        const usersIds = source.userSubscribedTo.map((user) => user.authorId);
        return dataloaders.userLoader.loadMany(usersIds);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source: UserWithSubscribe, _, { dataloaders }) => {
        if (!source.subscribedToUser?.length) return [];
        const usersIds = source.subscribedToUser.map((user) => user.subscriberId);
        return dataloaders.userLoader.loadMany(usersIds);
      },
    },
  }),
}) as GraphQLObjectType;

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User name, required, no default value',
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
