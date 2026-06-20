import { useNavigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useGetCardById } from '~/db/cards/cards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { ActivityLinkToCard } from './Activity.styled';

export function ActivityLinkTemplate({ children }: { children: string }) {
  function parse(text: string): ReactNode[] {
    const regex = /\{\{\s*linkTo:([0-9a-fA-F-]+)\s*\}\}/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const id = match[1];
      parts.push(<LinkToCard key={id} id={id} />);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
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
