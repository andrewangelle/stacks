import { getStore, id, now, type Timestamps } from '~test/mocks/memoryPrisma';

export type ProfileRecord = {
  id: string;
  userId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
} & Timestamps;

export const profileModel = {
  async upsert(args: {
    where: { userId: string };
    create: {
      userId: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
    update: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
  }) {
    const existing = getStore().profiles.find(
      (profile) => profile.userId === args.where.userId,
    );

    const timestamp = now();

    if (existing) {
      existing.email = args.update.email;

      if (args.update.firstName !== undefined) {
        existing.firstName = args.update.firstName;
      }

      if (args.update.lastName !== undefined) {
        existing.lastName = args.update.lastName;
      }

      existing.updatedAt = timestamp;

      return existing;
    }

    const created: ProfileRecord = {
      id: id(),
      userId: args.create.userId,
      email: args.create.email,
      firstName: args.create.firstName,
      lastName: args.create.lastName,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().profiles.push(created);

    return created;
  },

  async findUnique(args: { where: { userId: string } }) {
    return (
      getStore().profiles.find(
        (profile) => profile.userId === args.where.userId,
      ) ?? null
    );
  },
};
