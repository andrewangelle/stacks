import { useState } from 'react';
import {
  BoardTitle,
  EditBoardTitleForm,
  EditBoardTitleInput,
} from '~/components/Nav/Nav.styled';
import { useGetBoard, useUpdateBoard } from '~/db/boards/boards.query';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function BoardHeader() {
  const board = useGetBoard();
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

    if (
      editedBoardTitle !== board.data?.boardTitle &&
      editedBoardTitle.trim() !== ''
    ) {
      updateBoard({
        id: board.data?.id ?? '',
        boardTitle: editedBoardTitle ?? board.data?.boardTitle,
      });
    }
  }

  return (
    <>
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
            onBlur={onOutsideNameEditClick}
          />
        </EditBoardTitleForm>
      )}
    </>
  );
}
