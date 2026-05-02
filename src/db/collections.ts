import { createCollection, localOnlyCollectionOptions } from '@tanstack/db';

import type { LocalEntity, LocalTableName } from './LocalQueryBuilder';

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

export const collectionByTable: Record<
  LocalTableName,
  typeof stacksCollection
> = {
  stacks: stacksCollection,
  lists: listsCollection,
  cards: cardsCollection,
  checklists: checklistsCollection,
  'checklist-items': checklistItemsCollection,
  activity: activityCollection,
  profiles: profilesCollection,
};
