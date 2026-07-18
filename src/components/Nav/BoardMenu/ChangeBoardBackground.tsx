import { useRouter } from '@tanstack/react-router';
import { FaCheck } from 'react-icons/fa';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { ChangeBoardBackgroundChoice } from '~/components/Nav/BoardMenu/BoardMenu.styled';
import { useGetBoard, useUpdateBoard } from '~/db/boards/boards.query';
import { Center, Flex } from '~/styles/Page.styled';
import { useBoardBackgroundColor } from '~/utils/useBoardBackgroundColor';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const backgroundChoices: BoardBackground[] = [
  'green',
  'lightGreen',
  'blue',
  'orange',
  'red',
];

export function ChangeBoardBackground() {
  const currentBoardId = useCurrentBoardId();
  const board = useGetBoard();
  const currentColor = useBoardBackgroundColor();
  const updateBoard = useUpdateBoard();
  const router = useRouter();

  function onColorChange(color: BoardBackground) {
    updateBoard({
      boardId: currentBoardId,
      boardTitle: board.data?.boardTitle ?? '',
      boardColor: color,
    });
    router.invalidate();
  }

  return (
    <Flex data-testid="Flex" style={{ flexWrap: 'wrap' }}>
      {backgroundChoices.map((color) => (
        <ChangeBoardBackgroundChoice
          data-testid="ChangeBoardBackgroundChoice"
          key={color}
          background={color}
          onClick={() => onColorChange(color)}
        >
          {color === currentColor && (
            <Center data-testid="Center">
              <FaCheck />
            </Center>
          )}
        </ChangeBoardBackgroundChoice>
      ))}
    </Flex>
  );
}
