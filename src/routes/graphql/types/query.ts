/* eslint-disable prefer-const */
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { userResolvers } from '../query/query.js';

let UserType;
let ProfileType;
let PostType;
let SubscribersOnAuthorsType;
let MemberType;
UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: userResolvers.profile,
    posts: userResolvers.posts,
    userSubscribedTo: userResolvers.userSubscribedTo,
    subscribedToUser: userResolvers.subscribedToUser,
  }),
});
PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: { type: UserType },
  }),
});

ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: { type: UserType },
    memberType: userResolvers.memberType,
  }),
});

SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: { type: UserType },
    subscriberId: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: UserType },
    authorId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: { type: new GraphQLList(ProfileType) },
  }),
});
const MemberIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: MemberTypeId.BASIC },
    BUSINESS: { value: MemberTypeId.BUSINESS },
  },
});

export {
  UserType,
  PostType,
  ProfileType,
  SubscribersOnAuthorsType,
  MemberType,
  MemberIdType,
};
