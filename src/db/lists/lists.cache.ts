import {
  boardIdMatches,
  findBoard,
  getBoardsCache,
  type ListPayload,
  patchBoardLists,
  restoreBoardsCache,
  setBoardsCache,
} from '~/db/boards/boards.cache';
import { reorderLists as reorderListsServer } from '~/db/lists/lists.functions';
import type { MoveListArgs } from '~/db/lists/lists.schemas';

export function reorderDraggedList(
  boardId: string,
  fromIndex: number,
  toIndex: number,
) {
  const snapshot = getBoardsCache();

  patchBoardLists(boardId, (lists) => {
    const next = [...lists];
    next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
    return next.map(withPosition);
  });

  const boards = getBoardsCache();
  // `boardId` here is the route param, which is masked to an 8-char prefix on
  // the board url. The server matches board ids exactly, so send the full id
  // off the board we just resolved out of the cache.
  const board = boards ? findBoard(boards, boardId) : undefined;
  const orderedIds = board?.lists.map((list) => list.id) ?? [];

  if (!board || orderedIds.length === 0) {
    return;
  }

  reorderListsServer({ data: { boardId: board.id, orderedIds } }).catch(() => {
    restoreBoardsCache(snapshot);
  });
}

/**
 * Optimistic half of a list move: pull the list out of whichever board holds it
 * and splice it into the target board at the requested index, renumbering both
 * boards' positions the way the server will.
 */
export function moveListInBoardsCache({
  listId,
  targetBoardId,
  targetIndex,
}: MoveListArgs) {
  setBoardsCache((boards) => {
    let movedList: ListPayload | undefined;

    for (const board of boards) {
      movedList = board.lists.find((list) => list.id === listId);

      if (movedList) {
        break;
      }
    }

    if (!movedList) {
      return boards;
    }

    return boards.map((board) => {
      const withoutMoved = board.lists.filter((list) => list.id !== listId);
      const isTarget = boardIdMatches(board, targetBoardId);

      if (isTarget) {
        const index = Math.min(Math.max(targetIndex, 0), withoutMoved.length);
        withoutMoved.splice(index, 0, { ...movedList, boardId: board.id });
      }

      if (!isTarget && withoutMoved.length === board.lists.length) {
        return board;
      }

      return { ...board, lists: withoutMoved.map(withPosition) };
    });
  });
}

function withPosition(list: ListPayload, position: number) {
  return list.position === position ? list : { ...list, position };
}
