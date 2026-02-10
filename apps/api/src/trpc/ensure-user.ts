import { PrismaClient } from '@prisma/client';

type EnsuredUser = {
  id: string;
  clerkId: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
};

export async function ensureUserForClerkId(
  prisma: PrismaClient,
  clerkId: string,
): Promise<EnsuredUser> {
  return prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      username: `reader_${clerkId.slice(-8)}`,
    },
    update: {},
    select: {
      id: true,
      clerkId: true,
      username: true,
      name: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
    },
  });
}
