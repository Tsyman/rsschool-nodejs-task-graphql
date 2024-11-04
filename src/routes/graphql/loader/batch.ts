import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';
import DataLoader from 'dataloader';

export const batchPosts = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: Readonly<string[]>) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });

    return ids.map((id) => users.find((user) => user.id === id));
  });
};

export const batchProfile = (prismaClient: PrismaClient) => {
  return new DataLoader(async (ids) => {
    const profiles = await prismaClient.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    return ids.map((id) => profiles.find((profile) => profile.userId === id));
  });
};

export const batchMember = (prisma: PrismaClient) => {
  return new DataLoader(async (ids) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as MemberTypeId[] } },
    });

    return ids.map((id) => memberTypes.find((memberType) => memberType.id === id));
  });
};

export const batchUser = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: Readonly<string[]>) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });

    return ids.map((id) => users.find((user) => user.id === id));
  });
};
