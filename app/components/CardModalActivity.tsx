import { useParams } from '@tanstack/react-router';
import { formatRelative } from 'date-fns';
import { useState } from 'react';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import { useRecoilState } from 'recoil';

import { ActivityComment, ActivityLogo } from '~/components';
import {
  tokenState,
  useCreateActivityMutation,
  useGetActivityQuery,
  useGetProfileQuery,
} from '~/store';
import {
  ActivityCommentContainer,
  ActivityContainer,
  ActivityHeader,
  AddActivityInput,
  CardModalTitle,
  Flex,
  HideActivityButton,
  SaveCommentButton,
} from '~/styles';

export function CardModalActivity({
  listId,
  cardId,
}: {
  cardId: string;
  listId: string;
}) {
  const [showActivity, setShowActivity] = useState(false);
  const params = useParams({ strict: false });
  const [token] = useRecoilState(tokenState);
  const { data } = useGetActivityQuery({ cardId });
  const [comment, setComment] = useState<string>('');
  const profile = useGetProfileQuery(
    { userId: token?.user.id ?? '' },
    { skip: !token?.user.id },
  );
  const [createActivity] = useCreateActivityMutation();

  function createComment() {
    createActivity({
      boardId: params.id ?? '',
      cardId,
      listId,
      token: token?.access_token ?? '',
      userId: token?.user.id ?? '',
      type: 'comment',
      content: comment,
    });
    setComment('');
  }

  return (
    <div>
      <ActivityHeader>
        <Flex>
          <MdOutlineFormatListBulleted size={24} />
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
              new Date(comment.created_at),
              new Date(comment.created_at),
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
