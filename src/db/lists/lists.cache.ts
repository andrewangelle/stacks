import { reorderLists as reorderListsServer } from '~/db/lists/lists.functions';
import type { Card, List } from '~/generated/prisma/client';
import { queryClient } from '~/query';
import { listQueryKeys } from './lists.query';

export type ListCardItem = Pick<Card, 'id' | 'cardTitle' | 'createdAt'>;

export type ListItem = Pick<
  List,
  'id' | 'listTitle' | 'createdAt' | 'position' | 'boardId'
> & {
  cards: ListCardItem[];
};

export function toListItem(item: List): ListItem {
  return {
    id: item.id,
    listTitle: item.listTitle,
    createdAt: item.createdAt,
    position: item.position,
    boardId: item.boardId,
    cards: [],
  };
}

export function reorderListsByIndex(
  boardId: string,
  fromIndex: number,
  toIndex: number,
) {
  queryClient.setQueryData<ListItem[]>(
    listQueryKeys.list(boardId),
    (cache = []) => {
      const next = [...cache];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    },
  );

  const orderedIds =
    queryClient
      .getQueryData<ListItem[]>(listQueryKeys.list(boardId))
      ?.map((list) => list.id) ?? [];

  reorderListsServer({ data: { boardId, orderedIds } }).catch(() => {
    queryClient.invalidateQueries({ queryKey: listQueryKeys.list(boardId) });
  });
}
