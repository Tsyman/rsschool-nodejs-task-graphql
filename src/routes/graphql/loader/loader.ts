import DataLoader from 'dataloader';
import {
  PostLoader,
  ProfileLoader,
  memberTypeLoader,
  subscribeUserLoader,
} from '../types/common.js';

export const createLoaders = (prisma) => {
  const userLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });
    const usersMap = new Map<string, subscribeUserLoader>();
    users.forEach((user) => {
      usersMap.set(user.id, user);
    });
    return ids.map((id) => usersMap.get(id));
  });

  const profileLoader = new DataLoader<string, ProfileLoader>(async (usersId) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: usersId } },
    });
    return usersId.map((id) => profiles.find((profile) => profile.userId === id));
  });

  const postsLoader = new DataLoader<string, PostLoader[]>(async (authorIds) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds } },
    });

    const postsGroupedByAuthor = posts.reduce((map, post) => {
      map[post.authorId] = map[post.authorId] || [];
      map[post.authorId].push(post);
      return map;
    }, {});

    return authorIds.map((authorId) => postsGroupedByAuthor[authorId] || []);
  });

  const memberTypeLoader = new DataLoader<string, memberTypeLoader>(
    async (memberIds: readonly string[]) => {
      const memberTypes = await prisma.memberType.findMany({
        where: {
          id: {
            in: memberIds,
          },
        },
      });
      const memberTypeMap = memberTypes.reduce((map, memberType) => {
        map[memberType.id] = memberType;
        return map;
      }, {});
      return memberIds.map((id) => memberTypeMap[id] || []);
    },
  );

  return {
    profileLoader,
    postsLoader,
    memberTypeLoader,
    userLoader,
  };
};
