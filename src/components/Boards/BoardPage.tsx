import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Draggable } from '~/components/Draggable';
import { AddLists } from '~/components/Lists/AddList';
import { List } from '~/components/Lists/List';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import type { List as ListType } from '~/generated/prisma/client';
import { boardByIdQueryOptions } from '~/query/boards';
import { listsQueryOptions, reorderLists } from '~/query/lists';
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
      {lists?.map((list) => (
        <Draggable
          key={list.id}
          id={list.id}
          name={list.listTitle}
          type="list"
          onDrop={(item: ListType) => reorderLists(item, boardId, list.id)}
        >
          <List id={list.id} />
        </Draggable>
      ))}
      {boardId && <AddLists boardId={boardId} />}
      {children}
    </BoardPageBackground>
  );
}
