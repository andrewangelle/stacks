import { createCollection, localOnlyCollectionOptions } from '@tanstack/db';
import type { LocalEntity, LocalTableName } from '~/db/LocalQueryBuilder';

function createLocalCollection(table: LocalTableName) {
  return createCollection(
    localOnlyCollectionOptions<LocalEntity>({
      id: table,
      getKey: (item) => item.id,
      initialData: [],
    }),
  );
}

const stacksCollection = createLocalCollection('stacks');
const listsCollection = createLocalCollection('lists');
const cardsCollection = createLocalCollection('cards');
const checklistsCollection = createLocalCollection('checklists');
const checklistItemsCollection = createLocalCollection('checklist-items');
const activityCollection = createLocalCollection('activity');
const profilesCollection = createLocalCollection('profiles');

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
