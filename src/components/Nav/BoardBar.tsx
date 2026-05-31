import { useState } from 'react';
import {
  BoardBarContainer,
  BoardTitle,
  EditBoardTitleForm,
  EditBoardTitleInput,
} from '~/components/Nav/Nav.styled';
import { useGetBoard, useUpdateBoard } from '~/query/boards';
import { useBoardBackgroundColor } from '~/utils/useBoardBackgroundColor';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function BoardBar() {
  const board = useGetBoard();
  const background = useBoardBackgroundColor();
  const [isEditing, setEditing] = useState(false);
  const [editedBoardTitle, setEditedBoardTitle] = useState(' ');
  const outsideClickRef = useOutsideClick(onOutsideNameEditClick, isEditing);
  const updateBoard = useUpdateBoard();

  function toggleEditBoardTitleForm() {
    setEditing(true);
    setEditedBoardTitle(board.data?.boardTitle ?? '');
  }

  function onOutsideNameEditClick() {
    setEditing(false);

    if (editedBoardTitle !== board.data?.boardTitle) {
      updateBoard({
        id: board.data?.id ?? '',
        boardTitle: editedBoardTitle ?? board.data?.boardTitle,
      });
    }
  }

  return (
    <BoardBarContainer background={background} data-testid="BoardBarContainer">
      {!isEditing && (
        <BoardTitle data-testid="BoardTitle" onClick={toggleEditBoardTitleForm}>
          {board.data?.boardTitle}
        </BoardTitle>
      )}

      {isEditing && (
        <EditBoardTitleForm ref={outsideClickRef}>
          <EditBoardTitleInput
            name="boardTitle"
            data-testid="EditBoardTitleInput"
            value={editedBoardTitle}
            placeholder={board.data?.boardTitle}
            autoFocus
            onChange={(event) => setEditedBoardTitle(event.target.value)}
          />
        </EditBoardTitleForm>
      )}
    </BoardBarContainer>
  );
}
