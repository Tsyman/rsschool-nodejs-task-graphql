import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeIdField } from './member.js';
import { GraphQLObjectTypeWithContext } from './common.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { GraphQLInputObjectType, GraphQLInt } from 'graphql/index.js';

export const ProfileType = new GraphQLObjectTypeWithContext({
  name: 'ProfileType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLInt) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLBoolean) },
    userId: {
      type: new GraphQLNonNull(UUIDType),
      resolve: ({ id }: { id: string }, _, { db }) => {
        return db.user.findUnique({ where: { id } });
      },
    },
    memberType: {
      type: MemberType,
      resolve: async (
        { memberTypeId }: { memberTypeId: MemberTypeId },
        _,
        { dataloaders },
      ) => {
        return dataloaders.memberLoader.load(memberTypeId);
      },
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdField) },
  }),
});

export type CreateProfileDto = {
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeId;
};

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdField },
  }),
});
