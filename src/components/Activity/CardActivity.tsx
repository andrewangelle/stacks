import { useUser } from '@clerk/tanstack-react-start';
import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import {
  ActivityCommentContainer,
  ActivityContainer,
  ActivityHeader,
  ActivityTitle,
  AddActivityInput,
  HideActivityButton,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { ActivityComment } from '~/components/Activity/ActivityComment';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { useCreateActivity, useGetActivity } from '~/query/activity';
import { useGetCardById } from '~/query/cards';
import { Flex } from '~/styles/Page.styled';
import { formatActivityTime } from '~/utils/formatDateTime';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type CardActivityProps = {
  cardId: string;
};

export function CardActivity({ cardId }: CardActivityProps) {
  const { data: cardData } = useGetCardById({ id: cardId });

  const [showActivity, setShowActivity] = useState(false);
  const boardId = useCurrentBoardId();
  const { data } = useGetActivity({ cardId });
  const [comment, setComment] = useState<string>('');
  const { user } = useUser();
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
    <div>
      <ActivityHeader data-testid="ActivityHeader">
        <Flex data-testid="Flex" style={{ alignItems: 'baseline' }}>
          <BiCommentDetail
            size={18}
            style={{ position: 'relative', top: '4px' }}
          />
          <ActivityTitle data-testid="ActivityTitle">
            Comments and activity
          </ActivityTitle>
        </Flex>

        <HideActivityButton
          data-testid="HideActivityButton"
          secondary={true}
          onClick={() => setShowActivity((prev) => !prev)}
        >
          {showActivity ? 'Hide details' : 'Show details'}
        </HideActivityButton>
      </ActivityHeader>

      <ActivityContainer data-testid="ActivityContainer">
        <Flex data-testid="Flex">
          <AddActivityInput
            data-testid="AddActivityInput"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment..."
            autoFocus
          />
        </Flex>
        <SaveCommentButton
          data-testid="SaveCommentButton"
          onClick={createComment}
          disabled={!comment}
        >
          Save
        </SaveCommentButton>
      </ActivityContainer>

      {data
        ?.filter((value) => value.type === 'comment')
        .map((comment) => (
          <ActivityComment key={comment.id} {...comment} />
        ))}

      {showActivity &&
        data
          ?.filter((value) => value.type === 'feed')
          .map((comment) => {
            return (
              <ActivityContainer
                data-testid="ActivityContainer"
                key={comment.id}
              >
                <Flex data-testid="Flex">
                  <ActivityLogo />
                  <ActivityCommentContainer data-testid="ActivityCommentContainer">
                    <div style={{ marginLeft: '8px' }}>
                      <strong>
                        {user?.firstName} {user?.lastName}
                      </strong>{' '}
                      {comment.content}
                    </div>
                    <div style={{ marginLeft: '8px' }}>
                      {formatActivityTime(comment.createdAt)}
                    </div>
                  </ActivityCommentContainer>
                </Flex>
              </ActivityContainer>
            );
          })}
    </div>
  );
}
