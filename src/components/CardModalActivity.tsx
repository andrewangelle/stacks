import { useParams } from '@tanstack/react-router';
import { formatRelative } from 'date-fns';
import { useState } from 'react';
import * as Md from 'react-icons/md';
import { useSessionUserId } from '~/auth/useSessionUserId';
import { ActivityComment } from '~/components/ActivityComment';
import { ActivityLogo } from '~/components/ActivityLogo';
import {
  useCreateActivityMutation,
  useGetActivityQuery,
} from '~/store/activityApi';
import { useGetProfileQuery } from '~/store/profileApi';
import {
  ActivityCommentContainer,
  ActivityContainer,
  ActivityHeader,
  AddActivityInput,
  HideActivityButton,
  SaveCommentButton,
} from '~/styles/Activity';
import { CardModalTitle } from '~/styles/CardModal';
import { Flex } from '~/styles/Page';

type CardModalActivityProps = {
  listId: string;
  cardId: string;
};

export function CardModalActivity({ listId, cardId }: CardModalActivityProps) {
  const [showActivity, setShowActivity] = useState(false);
  const params = useParams({ strict: false });
  const userId = useSessionUserId();
  const { data } = useGetActivityQuery({ cardId });
  const [comment, setComment] = useState<string>('');
  const profile = useGetProfileQuery(
    { userId: userId ?? '' },
    { skip: !userId },
  );
  const [createActivity] = useCreateActivityMutation();

  function createComment() {
    createActivity({
      boardId: params.id ?? '',
      cardId,
      listId,
      type: 'comment',
      content: comment,
    });
    setComment('');
  }

  return (
    <div>
      <ActivityHeader>
        <Flex>
          <Md.MdOutlineFormatListBulleted size={24} />
          <CardModalTitle>Activity</CardModalTitle>
        </Flex>
        <HideActivityButton
          secondary
          onClick={() => setShowActivity((prev) => !prev)}
        >
          {showActivity ? 'Hide Activity' : 'Show Activity'}
        </HideActivityButton>
      </ActivityHeader>

      <ActivityContainer>
        <Flex>
          <ActivityLogo />
          <AddActivityInput
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment..."
          />
        </Flex>
        <SaveCommentButton onClick={createComment}>Save</SaveCommentButton>
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
            const commentTime = formatRelative(
              new Date(comment.createdAt),
              new Date(comment.createdAt),
            );
            return (
              <ActivityContainer key={comment.id}>
                <Flex>
                  <ActivityLogo />
                  <ActivityCommentContainer>
                    <div style={{ marginLeft: '8px' }}>
                      <strong>
                        {profile.data?.firstName} {profile.data?.lastName}
                      </strong>{' '}
                      {comment.content}
                    </div>
                    <div style={{ marginLeft: '8px' }}>{commentTime}</div>
                  </ActivityCommentContainer>
                </Flex>
              </ActivityContainer>
            );
          })}
    </div>
  );
}
