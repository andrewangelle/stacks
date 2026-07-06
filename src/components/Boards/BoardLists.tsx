import { useSuspenseQuery } from '@tanstack/react-query';
import { Fragment, type ReactNode, Suspense } from 'react';
import { Draggable } from '~/components/dnd/Draggable';
import { AddLists } from '~/components/Lists/AddList';
import { List } from '~/components/Lists/List';
import { ListSkeleton } from '~/components/Lists/ListSkeleton';
import { listsQueryOptions, reorderListsByIndex } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function BoardLists({ children }: { children?: ReactNode }) {
  const boardId = useCurrentBoardId();
  const { data: lists = [] } = useSuspenseQuery(listsQueryOptions(boardId));

  return (
    <Fragment>
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
          <Suspense fallback={<ListSkeleton key={list.id} />}>
            <List id={list.id} />
          </Suspense>
        </Draggable>
      ))}
      {boardId && <AddLists />}
      {children}
    </Fragment>
  );
}
