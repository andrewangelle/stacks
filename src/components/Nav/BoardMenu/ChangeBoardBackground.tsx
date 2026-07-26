import { useRouter } from '@tanstack/react-router';
import { FaCheck } from 'react-icons/fa';
import * as boardMenuStyles from '~/components/Nav/BoardMenu/BoardMenu.css';
import { useGetBoard, useUpdateBoard } from '~/db/boards/boards.query';
import * as pageStyles from '~/styles/Page.css';
import type { BoardBackground } from '~/styles/tokens';
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
    <div
      className={boardMenuStyles.changeBoardBackgroundChoiceContainer}
      data-testid="Flex"
    >
      {backgroundChoices.map((color) => (
        // biome-ignore lint/a11y/useSemanticElements: <style conflict>
        <div
          role="button"
          tabIndex={0}
          className={boardMenuStyles.changeBoardBackgroundChoice({
            background: color,
          })}
          data-testid="ChangeBoardBackgroundChoice"
          key={color}
          onClick={() => onColorChange(color)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              onColorChange(color);
            }
          }}
        >
          {color === currentColor && (
            <div className={pageStyles.center} data-testid="Center">
              <FaCheck />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
