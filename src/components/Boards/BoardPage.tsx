import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Draggable } from '~/components/dnd/Draggable';
import { AddLists } from '~/components/Lists/AddList';
import { List } from '~/components/Lists/List';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { listsQueryOptions, reorderListsByIndex } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function BoardPage({ children }: { children?: ReactNode }) {
  const boardId = useCurrentBoardId();
  const { data: board } = useSuspenseQuery(boardByIdQueryOptions(boardId));
  const { data: lists = [] } = useSuspenseQuery(listsQueryOptions(boardId));

  return (
    <BoardPageBackground
      data-testid="BoardPageBackground"
      background={board?.boardColor}
    >
      {lists?.map((list, index) => (
        <Draggable
          key={list.id}
          id={list.id}
          name={list.listTitle}
          type="list"
          index={index}
          group={boardId}
          onReorder={(fromIndex, toIndex) =>
            reorderListsByIndex(boardId, fromIndex, toIndex)
          }
        >
          <List id={list.id} />
        </Draggable>
      ))}
      {boardId && <AddLists />}
      {children}
    </BoardPageBackground>
  );
}
