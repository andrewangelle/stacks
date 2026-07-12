import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { ActivityLinkToCard } from '~/components/Activity/Activity.styled';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { useGetCardById } from '~/db/cards/cards.query';
import { useGetListById } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const LINK_COMPONENTS = {
  linkToBoard: LinkToBoard,
  linkToList: LinkToList,
  linkTo: LinkToCard,
} as const;

export function ActivityLinkTemplate({ children }: { children: string }) {
  function parse(text: string): ReactNode[] {
    const regex =
      /\{\{\s*(linkToBoard|linkToList|linkTo):([0-9a-fA-F-]+)\s*\}\}/g;
    const parts: ReactNode[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const [, kind, id] = match;
      const Link = LINK_COMPONENTS[kind as keyof typeof LINK_COMPONENTS];
      parts.push(<Link key={id} id={id} />);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text?.length) {
      parts.push(text?.slice(lastIndex));
    }

    return parts;
  }

  return <>{parse(children)}</>;
}

function LinkToCard({ id }: { id: string }) {
  const { data: card } = useGetCardById({ id });
  const navigate = useNavigate();
  const boardId = useCurrentBoardId();
  return (
    <ActivityLinkToCard
      id={id}
      onClick={() => {
        navigate({
          to: '/board/$id/card/$cardId',
          params: { id: boardId, cardId: id },
        });
      }}
    >
      {card?.cardTitle}
    </ActivityLinkToCard>
  );
}

function LinkToBoard({ id }: { id: string }) {
  const { data: board } = useQuery(boardByIdQueryOptions(id));
  const navigate = useNavigate();
  return (
    <ActivityLinkToCard
      id={id}
      onClick={() => {
        navigate({ to: '/board/$id', params: { id } });
      }}
    >
      {board?.boardTitle}
    </ActivityLinkToCard>
  );
}

function LinkToList({ id }: { id: string }) {
  const { data: list } = useGetListById({ id });
  const navigate = useNavigate();
  return (
    <ActivityLinkToCard
      id={id}
      onClick={() => {
        navigate({ to: '/board/$id', params: { id: list?.boardId ?? '' } });
      }}
    >
      {list?.listTitle}
    </ActivityLinkToCard>
  );
}
