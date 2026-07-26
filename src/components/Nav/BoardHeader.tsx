import { useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { CardTitleDetailsSpinner } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { BoardMenu } from '~/components/Nav/BoardMenu/BoardMenu';
import { BoardMenuTriggerLoaderSlot } from '~/components/Nav/BoardMenu/BoardMenu.styled';
import {
  BoardTitle,
  EditBoardTitleForm,
  EditBoardTitleInput,
} from '~/components/Nav/Nav.styled';
import { useGetBoard, useUpdateBoard } from '~/db/boards/boards.query';
import { Flex } from '~/styles/Page.styled';
import { useBoardBackgroundColor } from '~/utils/useBoardBackgroundColor';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function BoardHeader() {
  const currentColor = useBoardBackgroundColor();
  const board = useGetBoard();
  const [isEditing, setEditing] = useState(false);
  const [editedBoardTitle, setEditedBoardTitle] = useState(' ');
  const outsideClickRef = useOutsideClick(onOutsideNameEditClick, isEditing);
  const updateBoard = useUpdateBoard();
  const routerState = useRouterState();

  const loading = routerState.isLoading || routerState.isTransitioning;

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
        boardId: board.data?.id ?? '',
        boardTitle: editedBoardTitle ?? board.data?.boardTitle,
        boardColor: currentColor,
      });
    }
  }

  return (
    <Flex
      style={{
        justifyContent: 'space-between',
      }}
    >
      <div>
        {!isEditing && (
          <BoardTitle
            data-testid="BoardTitle"
            type="button"
            onClick={toggleEditBoardTitleForm}
            aria-label="Edit board title"
          >
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
      </div>

      {loading && (
        <BoardMenuTriggerLoaderSlot data-testid="BoardMenuTriggerLoaderSlot">
          <CardTitleDetailsSpinner />
        </BoardMenuTriggerLoaderSlot>
      )}

      {!loading && <BoardMenu />}
    </Flex>
  );
}
