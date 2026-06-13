import { useState } from 'react';
import {
  ActivityRow,
  AddCommentContainer,
  AddCommentForm,
  AddCommentInput,
  EditCommentActionsRow,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { useCreateActivity } from '~/query/activity';
import { useGetCardById } from '~/query/cards';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type AddCommentProps = {
  cardId: string;
};

export function AddComment({ cardId }: AddCommentProps) {
  const { data: cardData } = useGetCardById({ id: cardId });
  const boardId = useCurrentBoardId();
  const [comment, setComment] = useState<string>('');
  const createActivity = useCreateActivity();

  function createComment() {
    createActivity({
      boardId,
      cardId,
      listId: cardData?.listId ?? '',
      type: 'comment',
      content: comment,
    });
    setComment('');
  }

  return (
    <AddCommentContainer data-testid="AddCommentContainer">
      <ActivityRow data-testid="ActivityRow">
        <ActivityLogo />

        <AddCommentForm onSubmit={(event) => event.preventDefault()}>
          <AddCommentInput
            data-testid="AddCommentInput"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment..."
          />

          <EditCommentActionsRow data-testid="EditCommentActions">
            <SaveCommentButton
              data-testid="SaveCommentButton"
              onClick={createComment}
              disabled={!comment}
            >
              Save
            </SaveCommentButton>
          </EditCommentActionsRow>
        </AddCommentForm>
      </ActivityRow>
    </AddCommentContainer>
  );
}
