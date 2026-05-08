import { createCollection, localStorageCollectionOptions } from '@tanstack/db';
import type { LocalEntity, LocalTableName } from '~/db/LocalQueryBuilder';
import { safeStorage, safeStorageEventApi } from '~/db/storage';

function createLocalStorageCollection(table: LocalTableName) {
  return createCollection(
    localStorageCollectionOptions<LocalEntity>({
      id: table,
      storageKey: `stacks:db:${table}`,
      storage: safeStorage,
      storageEventApi: safeStorageEventApi,
      getKey: (item) => item.id,
    }),
  );
}

const stacksCollection = createLocalStorageCollection('stacks');
const listsCollection = createLocalStorageCollection('lists');
const cardsCollection = createLocalStorageCollection('cards');
const checklistsCollection = createLocalStorageCollection('checklists');
const checklistItemsCollection =
  createLocalStorageCollection('checklist-items');
const activityCollection = createLocalStorageCollection('activity');
const profilesCollection = createLocalStorageCollection('profiles');

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
