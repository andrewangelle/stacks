import type { getBoards } from '~/db/boards/boards.functions';
import { queryClient } from '~/query';

/**
 * The `['boards']` query holds the user's entire workspace — the result of the
 * single joined query in boards.server.ts. Every read hook selects its slice
 * out of this tree (see the *.query.ts files), and every mutation patches the
 * tree through the helpers below, so there are no copies to fall out of sync.
 *
 * Card activity is the single exception: it is cached per card, because it
 * scales with history rather than with current state. See activity.cache.ts.
 */

export type BoardsPayload = Awaited<ReturnType<typeof getBoards>>;
export type BoardPayload = BoardsPayload[number];
export type ListPayload = BoardPayload['lists'][number];
export type CardPayload = ListPayload['cards'][number];
export type ChecklistPayload = CardPayload['checklists'][number];
export type ChecklistItemPayload = ChecklistPayload['items'][number];

export const boardsQueryKey = ['boards'] as const;

/**
 * Board ids in route params may be the 8-char masked prefix from a shared URL;
 * ids in the payload are always full. An empty candidate matches nothing.
 */
export function boardIdMatches(board: { id: string }, idOrPrefix: string) {
  return idOrPrefix !== '' && board.id.startsWith(idOrPrefix);
}

export function getBoardsCache() {
  return queryClient.getQueryData<BoardsPayload>(boardsQueryKey);
}

export function invalidateBoardsCache() {
  return queryClient.invalidateQueries({ queryKey: boardsQueryKey });
}

export function restoreBoardsCache(snapshot: BoardsPayload | undefined) {
  if (snapshot) {
    queryClient.setQueryData<BoardsPayload>(boardsQueryKey, snapshot);
  } else {
    invalidateBoardsCache();
  }
}

export function findBoard(boards: BoardsPayload, boardId: string) {
  return boards.find((board) => boardIdMatches(board, boardId));
}

export function findList(boards: BoardsPayload, listId: string) {
  for (const board of boards) {
    const list = board.lists.find((candidate) => candidate.id === listId);

    if (list) {
      return list;
    }
  }

  return undefined;
}

export function findCard(boards: BoardsPayload, cardId: string) {
  for (const board of boards) {
    for (const list of board.lists) {
      const card = list.cards.find((candidate) => candidate.id === cardId);

      if (card) {
        return card;
      }
    }
  }

  return undefined;
}

export function findChecklist(boards: BoardsPayload, checklistId: string) {
  for (const board of boards) {
    for (const list of board.lists) {
      for (const card of list.cards) {
        const checklist = card.checklists.find(
          (candidate) => candidate.id === checklistId,
        );

        if (checklist) {
          return checklist;
        }
      }
    }
  }

  return undefined;
}

/**
 * Patchers replace one node and clone the containers on the path to it.
 * setQueryData's structural sharing restores reference identity for branches
 * that end up deep-equal, so selector results stay stable for untouched data.
 */
export function setBoardsCache(
  update: (boards: BoardsPayload) => BoardsPayload,
) {
  queryClient.setQueryData<BoardsPayload>(boardsQueryKey, (boards) =>
    boards ? update(boards) : boards,
  );
}

export function patchBoard(
  boardId: string,
  patch: (board: BoardPayload) => BoardPayload,
) {
  setBoardsCache((boards) =>
    boards.map((board) =>
      boardIdMatches(board, boardId) ? patch(board) : board,
    ),
  );
}

export function patchBoardLists(
  boardId: string,
  patch: (lists: ListPayload[]) => ListPayload[],
) {
  patchBoard(boardId, (board) => ({ ...board, lists: patch(board.lists) }));
}

export function patchList(
  listId: string,
  patch: (list: ListPayload) => ListPayload,
) {
  setBoardsCache((boards) =>
    boards.map((board) => ({
      ...board,
      lists: board.lists.map((list) =>
        list.id === listId ? patch(list) : list,
      ),
    })),
  );
}

export function patchListCards(
  listId: string,
  patch: (cards: CardPayload[]) => CardPayload[],
) {
  patchList(listId, (list) => ({ ...list, cards: patch(list.cards) }));
}

export function patchCard(
  cardId: string,
  patch: (card: CardPayload) => CardPayload,
) {
  setBoardsCache((boards) =>
    boards.map((board) => ({
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) =>
          card.id === cardId ? patch(card) : card,
        ),
      })),
    })),
  );
}

export function patchCardChecklists(
  cardId: string,
  patch: (checklists: ChecklistPayload[]) => ChecklistPayload[],
) {
  patchCard(cardId, (card) => ({
    ...card,
    checklists: patch(card.checklists),
  }));
}

/**
 * Keep the card front's comment count in step with the per-card activity cache.
 * The count is the only thing the boards tree knows about activity.
 */
export function patchCardCommentsCount(cardId: string, delta: number) {
  patchCard(cardId, (card) => ({
    ...card,
    _count: {
      ...card._count,
      activities: Math.max(card._count.activities + delta, 0),
    },
  }));
}

export function patchChecklist(
  checklistId: string,
  patch: (checklist: ChecklistPayload) => ChecklistPayload,
) {
  setBoardsCache((boards) =>
    boards.map((board) => ({
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) => ({
          ...card,
          checklists: card.checklists.map((checklist) =>
            checklist.id === checklistId ? patch(checklist) : checklist,
          ),
        })),
      })),
    })),
  );
}

export function patchChecklistItems(
  checklistId: string,
  patch: (items: ChecklistItemPayload[]) => ChecklistItemPayload[],
) {
  patchChecklist(checklistId, (checklist) => ({
    ...checklist,
    items: patch(checklist.items),
  }));
}
