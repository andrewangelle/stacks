import { useState } from 'react';
import {
  BoardBarContainer,
  BoardTitle,
  EditBoardTitleInput,
} from '~/components/Nav/Nav.styled';
import { useGetBoardQuery, useUpdateBoardMutation } from '~/query/boards';
import { useBoardBackgroundColor } from '~/utils/useBoardBackgroundColor';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function BoardBar() {
  const board = useGetBoardQuery();
  const background = useBoardBackgroundColor();
  const [isEditing, setEditing] = useState(false);
  const [editedBoardTitle, setEditedBoardTitle] = useState('');
  const outsideClickRef = useOutsideClick(onOutsideNameEditClick, isEditing);
  const [updateBoard] = useUpdateBoardMutation();

  function onOutsideNameEditClick() {
    setEditing(false);

    if (editedBoardTitle !== board.data?.boardTitle) {
      updateBoard({
        id: board.data?.id ?? '',
        boardTitle: editedBoardTitle,
      });
    }
  }

  return (
    <BoardBarContainer background={background} data-testid="BoardBarContainer">
      {!isEditing && (
        <BoardTitle data-testid="BoardTitle" onClick={() => setEditing(true)}>
          {board.data?.boardTitle}
        </BoardTitle>
      )}

      {isEditing && (
        <form
          ref={outsideClickRef}
          style={{
            width: 'max-content',
            height: '40px',
            position: 'relative',
            top: '-5px',
          }}
        >
          <EditBoardTitleInput
            name="boardTitle"
            data-testid="EditBoardTitleInput"
            value={editedBoardTitle}
            placeholder={board.data?.boardTitle}
            onChange={(event) => setEditedBoardTitle(event.target.value)}
          />
        </form>
      )}
    </BoardBarContainer>
  );
}
