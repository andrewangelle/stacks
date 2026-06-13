import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import {
  ActivityCommentContainer,
  ActivityHeader,
  ActivityHeaderTitle,
  ActivityPanel,
  ActivityRow,
  ActivityTitle,
  AddActivityInput,
  AddCommentContainer,
  EditCommentActionsRow,
  HideActivityButton,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { ActivityComment } from '~/components/Activity/ActivityComment';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import {
  useCreateActivity,
  useGetActivity,
  useGetComments,
} from '~/query/activity';
import { useGetCardById } from '~/query/cards';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { ActivityEntry } from './ActivityEntry';

type CardActivityProps = {
  cardId: string;
};

export function CardActivity({ cardId }: CardActivityProps) {
  const { data: cardData } = useGetCardById({ id: cardId });
  const [showActivity, setShowActivity] = useState(true);
  const boardId = useCurrentBoardId();
  const { data } = useGetActivity({ cardId });
  const { data: comments } = useGetComments({ cardId });
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
    <ActivityPanel data-testid="ActivityPanel">
      <ActivityHeader data-testid="ActivityHeader">
        <ActivityHeaderTitle data-testid="ActivityHeaderTitle">
          <BiCommentDetail
            size={18}
            style={{ position: 'relative', top: '4px', flexShrink: 0 }}
          />
          <ActivityTitle data-testid="ActivityTitle">
            Comments and activity
          </ActivityTitle>
        </ActivityHeaderTitle>

        <HideActivityButton
          data-testid="HideActivityButton"
          secondary={true}
          onClick={() => setShowActivity((prev) => !prev)}
        >
          {showActivity ? 'Hide details' : 'Show details'}
        </HideActivityButton>
      </ActivityHeader>

      <AddCommentContainer data-testid="AddCommentContainer">
        <ActivityRow data-testid="ActivityRow">
          <ActivityLogo />

          <ActivityCommentContainer>
            <AddActivityInput
              data-testid="AddActivityInput"
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
          </ActivityCommentContainer>
        </ActivityRow>
      </AddCommentContainer>

      {!showActivity &&
        comments?.map((comment) => (
          <ActivityComment key={comment.id} id={comment.id} />
        ))}

      {showActivity &&
        data?.map((entry) =>
          entry?.type === 'feed' ? (
            <ActivityEntry key={entry.id} id={entry.id} />
          ) : (
            <ActivityComment key={entry.id} id={entry.id} />
          ),
        )}
    </ActivityPanel>
  );
}
