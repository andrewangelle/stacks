import {
  createId,
  LocalQueryBuilder,
  type LocalTableName,
} from '~/db/LocalQueryBuilder';

const localUsers = new Map<
  string,
  { id: string; email: string; password: string }
>();

type SignUpParams = {
  email: string;
  password: string;
};

function createLocalClient() {
  return {
    auth: {
      async signUp({ email, password }: SignUpParams) {
        const user = { id: createId(), email, password };

        localUsers.set(email, user);

        return {
          user: { id: user.id, email: user.email, role: 'authenticated' },
          error: null,
        };
      },

      async signIn({ email, password }: SignUpParams) {
        const user = localUsers.get(email);

        if (!user || user.password !== password) {
          return {
            user: null,
            session: null,
            error: { message: 'Invalid email or password' },
          };
        }

        return {
          user: { id: user.id, email: user.email, role: 'authenticated' },
          session: {
            access_token: `local-${user.id}`,
            expires_at: `${Date.now() + 60 * 60 * 1000}`,
            expires_in: '3600',
            refresh_token: `refresh-local-${user.id}`,
            token_type: 'bearer',
            user: {
              id: user.id,
              email: user.email,
            },
          },
          error: null,
        };
      },
    },
    from(table: LocalTableName) {
      return new LocalQueryBuilder(table);
    },
  };
}

export default function createClient(_token?: string) {
  return createLocalClient();
}
