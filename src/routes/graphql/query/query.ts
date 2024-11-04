import { GraphQLList, GraphQLNonNull } from 'graphql';
import {
  MemberIdType,
  MemberType,
  PostType,
  ProfileType,
  UserType,
} from '../types/query.js';
import { GraphQLContext } from '../types/common.js';
import { UUIDType } from '../types/uuid.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

const users = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: async (_parent, _args, context, info) => {
    const parsedInfo = parseResolveInfo(info);
    if (!parsedInfo) return null;

    const { fields } = simplifyParsedResolveInfoFragmentWithType(
      parsedInfo as ResolveTree,
      new GraphQLList(UserType),
    );
    const includeSubscribedToUser = 'subscribedToUser' in fields;
    const includeUserSubscribedTo = 'userSubscribedTo' in fields;

    const users = await context.prisma.user.findMany({
      include: {
        subscribedToUser: includeSubscribedToUser,
        userSubscribedTo: includeUserSubscribedTo,
      },
    });

    users.forEach((user) => {
      context.loaders.userLoader.prime(user.id, user);
    });

    return users;
  },
};

const user = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) => {
    return await context.loaders.userLoader.load(args.id);
  },
};

const posts = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
  resolve: async (_parent, _args, context: GraphQLContext) =>
    context.prisma.post.findMany(),
};

const post = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) =>
    context.prisma.post.findUnique({ where: { id: args.id } }),
};

const profiles = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: async (_parent, _args, context: GraphQLContext) =>
    context.prisma.profile.findMany(),
};

const profile = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) =>
    context.prisma.profile.findUnique({ where: { id: args.id } }),
};

const memberTypes = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: async (_parent, _args, context: GraphQLContext) =>
    context.prisma.memberType.findMany(),
};

const memberType = {
  type: MemberType,
  args: {
    id: { type: new GraphQLNonNull(MemberIdType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) =>
    context.prisma.memberType.findUnique({ where: { id: args.id } }),
};

export const userResolvers = {
  profile: {
    type: ProfileType,
    resolve: async (user, _args, context: GraphQLContext) => {
      return context.loaders.profileLoader.load(user.id);
    },
  },

  posts: {
    type: new GraphQLList(PostType),
    resolve: async (user, _args, context: GraphQLContext) => {
      return context.loaders.postsLoader.load(user.id);
    },
  },

  userSubscribedTo: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (parent, _args, context: GraphQLContext) => {
      if (!parent.userSubscribedTo || !Array.isArray(parent.userSubscribedTo)) {
        return [];
      }

      const authorIds = parent.userSubscribedTo.map((sub) => sub.authorId);

      return context.loaders.userLoader.loadMany(authorIds);
    },
  },

  subscribedToUser: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async ({ subscribedToUser }, _args, context: GraphQLContext) => {
      if (subscribedToUser) {
        return await context.loaders.userLoader.loadMany(
          subscribedToUser.map((user) => user.subscriberId),
        );
      }

      return null;
    },
  },

  memberType: {
    type: MemberType,
    resolve: async (profile, _args, context: GraphQLContext) => {
      return context.loaders.memberTypeLoader.load(profile.memberTypeId);
    },
  },
};

export const queryFields = {
  users: { ...users },
  user: { ...user },
  posts: { ...posts },
  post: { ...post },
  profiles: { ...profiles },
  profile: { ...profile },
  memberTypes: { ...memberTypes },
  memberType: { ...memberType },
};
