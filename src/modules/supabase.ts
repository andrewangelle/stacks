import { createClient } from '@supabase/supabase-js';
import { createCollection, localOnlyCollectionOptions } from '@tanstack/db';

type LocalEntity = { id: string | number } & Record<string, unknown>;
type LocalRow = Record<string, unknown>;
type LocalTableName =
  | 'stacks'
  | 'lists'
  | 'cards'
  | 'checklists'
  | 'checklist-items'
  | 'activity'
  | 'profiles';

const isProduction = process.env.NODE_ENV === 'production';
const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const stacksCollection = createCollection(
  localOnlyCollectionOptions<LocalEntity>({
    id: 'stacks',
    getKey: (item) => item.id,
    initialData: [],
  }),
);

const listsCollection = createCollection(
  localOnlyCollectionOptions<LocalEntity>({
    id: 'lists',
    getKey: (item) => item.id,
    initialData: [],
  }),
);

const cardsCollection = createCollection(
  localOnlyCollectionOptions<LocalEntity>({
    id: 'cards',
    getKey: (item) => item.id,
    initialData: [],
  }),
);

const checklistsCollection = createCollection(
  localOnlyCollectionOptions<LocalEntity>({
    id: 'checklists',
    getKey: (item) => item.id,
    initialData: [],
  }),
);

const checklistItemsCollection = createCollection(
  localOnlyCollectionOptions<LocalEntity>({
    id: 'checklist-items',
    getKey: (item) => item.id,
    initialData: [],
  }),
);

const activityCollection = createCollection(
  localOnlyCollectionOptions<LocalEntity>({
    id: 'activity',
    getKey: (item) => item.id,
    initialData: [],
  }),
);

const profilesCollection = createCollection(
  localOnlyCollectionOptions<LocalEntity>({
    id: 'profiles',
    getKey: (item) => item.id,
    initialData: [],
  }),
);

const collectionByTable: Record<LocalTableName, typeof stacksCollection> = {
  stacks: stacksCollection,
  lists: listsCollection,
  cards: cardsCollection,
  checklists: checklistsCollection,
  'checklist-items': checklistItemsCollection,
  activity: activityCollection,
  profiles: profilesCollection,
};

const matchesCriteria = (row: LocalRow, criteria: Record<string, unknown>) =>
  Object.entries(criteria).every(([key, value]) => row[key] === value);

const readRowId = (row: LocalRow) => {
  const id = row.id;
  if (typeof id === 'string' || typeof id === 'number') {
    return id;
  }
  return undefined;
};

class LocalQueryBuilder {
  private operation: 'select' | 'update' | 'delete' = 'select';
  private updateRows: LocalRow[] = [];

  constructor(private readonly table: LocalTableName) {}

  get data() {
    return [...collectionByTable[this.table].toArray];
  }

  select() {
    this.operation = 'select';
    return this;
  }

  insert(rows: LocalRow[]) {
    const preparedRows = rows.map((row) => ({
      ...row,
      id:
        typeof row.id === 'string' || typeof row.id === 'number'
          ? row.id
          : createId(),
    }));
    collectionByTable[this.table].insert(preparedRows);
    return Promise.resolve({ data: preparedRows, error: null });
  }

  update(rows: LocalRow[]) {
    this.operation = 'update';
    this.updateRows = rows;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  match(criteria: Record<string, unknown>) {
    const collection = collectionByTable[this.table];
    const matchedRows = collection.toArray.filter((row) =>
      matchesCriteria(row, criteria),
    );

    if (this.operation === 'select') {
      return Promise.resolve({ data: matchedRows, error: null });
    }

    if (this.operation === 'update') {
      const patch = this.updateRows[0] ?? {};
      matchedRows.forEach((row) => {
        const rowId = readRowId(row);
        if (rowId !== undefined) {
          collection.update(rowId, (draft) => {
            Object.assign(draft, patch);
          });
        }
      });
      const updatedRows = collection.toArray.filter((row) =>
        matchesCriteria(row, criteria),
      );
      return Promise.resolve({ data: updatedRows, error: null });
    }

    matchedRows.forEach((row) => {
      const rowId = readRowId(row);
      if (rowId !== undefined) {
        collection.delete(rowId);
      }
    });
    return Promise.resolve({ data: matchedRows, error: null });
  }
}

const localUsers = new Map<
  string,
  { id: string; email: string; password: string }
>();

const createLocalClient = () => ({
  auth: {
    signUp: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const user = { id: createId(), email, password };
      localUsers.set(email, user);
      return {
        user: { id: user.id, email: user.email, role: 'authenticated' },
        error: null,
      };
    },
    signIn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
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
  from: (table: LocalTableName) => new LocalQueryBuilder(table),
});

export default (token?: string) => {
  if (!isProduction) {
    return createLocalClient();
  }

  return createClient(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_API_KEY ?? '',
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {},
  );
};
