import { useState } from 'react';
import {
  ActivityRow,
  AddCommentContainer,
  AddCommentForm,
  AddCommentTrigger,
  CommentEditorContainer,
  EditCommentActionsRow,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { CloseAddCardButton } from '~/components/Lists/List.styled';
import { RichTextEditor } from '~/components/shared/RichText/RichTextEditor';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useGetCardById } from '~/db/cards/cards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function AddComment() {
  const cardId = useCurrentCardId();
  const { data: cardData } = useGetCardById({ id: cardId });
  const boardId = useCurrentBoardId();
  const [isEditing, setEditing] = useState(false);
  const [comment, setComment] = useState<string>('');
  const createActivity = useCreateActivity();

  const placeHolderText = 'Write a comment...';

  function createComment() {
    createActivity({
      boardId,
      cardId,
      listId: cardData?.listId ?? '',
      type: 'comment',
      content: comment,
    });
    closeEditor();
  }

  // Collapsing unmounts the editor, which is also what empties the draft: the
  // editor owns its document once mounted.
  function closeEditor() {
    setComment('');
    setEditing(false);
  }

  return (
    <AddCommentContainer>
      <ActivityRow>
        {!isEditing && (
          <AddCommentTrigger onClick={() => setEditing(true)}>
            {placeHolderText}
          </AddCommentTrigger>
        )}

        {isEditing && (
          <AddCommentForm onSubmit={(event) => event.preventDefault()}>
            <CommentEditorContainer>
              <RichTextEditor
                placeholder={placeHolderText}
                ariaLabel="Write a comment"
                testId="AddCommentInput"
                autoFocus
                minHeight="60px"
                onChange={setComment}
              />
            </CommentEditorContainer>

            <EditCommentActionsRow data-testid="EditCommentActions">
              <SaveCommentButton onClick={createComment} disabled={!comment}>
                Save
              </SaveCommentButton>

              <CloseAddCardButton
                type="button"
                $secondary
                onClick={closeEditor}
              >
                Cancel
              </CloseAddCardButton>
            </EditCommentActionsRow>
          </AddCommentForm>
        )}
      </ActivityRow>
    </AddCommentContainer>
  );
}
