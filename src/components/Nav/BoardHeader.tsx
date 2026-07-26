import { useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import * as cardTitleDetailsStyles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';
import { BoardMenu } from '~/components/Nav/BoardMenu/BoardMenu';
import * as boardMenuStyles from '~/components/Nav/BoardMenu/BoardMenu.css';
import * as navStyles from '~/components/Nav/Nav.css';
import { useGetBoard, useUpdateBoard } from '~/db/boards/boards.query';
import * as pageStyles from '~/styles/Page.css';
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
    <div
      className={pageStyles.flex}
      style={{
        justifyContent: 'space-between',
      }}
    >
      <div>
        {!isEditing && (
          <button
            className={navStyles.boardTitle}
            data-testid="BoardTitle"
            type="button"
            onClick={toggleEditBoardTitleForm}
            aria-label="Edit board title"
          >
            {board.data?.boardTitle}
          </button>
        )}

        {isEditing && (
          <form className={navStyles.editBoardTitleForm} ref={outsideClickRef}>
            <input
              className={navStyles.editBoardTitleInput}
              name="boardTitle"
              data-testid="EditBoardTitleInput"
              value={editedBoardTitle}
              placeholder={board.data?.boardTitle}
              onChange={(event) => setEditedBoardTitle(event.target.value)}
              onBlur={onOutsideNameEditClick}
            />
          </form>
        )}
      </div>

      {loading && (
        <span
          className={boardMenuStyles.boardMenuTriggerLoaderSlot}
          data-testid="BoardMenuTriggerLoaderSlot"
        >
          <div className={cardTitleDetailsStyles.cardTitleDetailsSpinner} />
        </span>
      )}

      {!loading && <BoardMenu />}
    </div>
  );
}
