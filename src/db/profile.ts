import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '~/db/prisma';

const GetProfileSchema = z.object({
  userId: z.string(),
});

export const getProfile = createServerFn({ method: 'GET' })
  .inputValidator(GetProfileSchema)
  .handler(async ({ data }) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: data.userId },
    });

    if (!profile) {
      throw new Error('Profile Not found');
    }

    return {
      id: profile.id,
      createdAt: profile.createdAt.toISOString(),
      email: profile.email ?? '',
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
    };
  });
