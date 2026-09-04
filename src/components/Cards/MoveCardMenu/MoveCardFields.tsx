import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { MoveCardForm } from '~/components/Cards/MoveCardMenu/MoveCardForm';
import {
  MoveCardMenuContent,
  MoveCardMenuHeader,
} from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function MoveCardFields({ id }: { id: string }) {
  const sourceBoardId = useCurrentBoardId();
  const navigate = useNavigate();

  const handleMoved = useCallback(() => {
    navigate({
      to: '/board/$id',
      params: { id: sourceBoardId },
      hash: '',
      search: { from: `card-${id}` },
    });
  }, [navigate, sourceBoardId, id]);

  return (
    <MoveCardMenuContent
      side="bottom"
      align="start"
      sideOffset={8}
      alignOffset={4}
    >
      <MoveCardMenuHeader>
        Move card
        <PopoverClose>X</PopoverClose>
      </MoveCardMenuHeader>

      <CreateBoardCloseBorder />

      <MoveCardForm id={id} onMoved={handleMoved} />
    </MoveCardMenuContent>
  );
}
