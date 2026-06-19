import { useState } from 'react';
import { ActivityCommentContent } from '~/components/Activity/Activity.styled';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { EditCommentActions } from '~/components/Activity/EditCommentActions';
import { EditCommentForm } from '~/components/Activity/EditCommentForm';
import { useGetActivityById } from '~/db/activity/activity.query';
import type { Activity } from '~/generated/prisma/client';

type EditableCommentProps = Pick<Activity, 'id'>;

export function EditableComment({ id }: EditableCommentProps) {
  const { isLoading, data } = useGetActivityById({ activityId: id });
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  if (isEditing) {
    return (
      <EditCommentForm
        id={id}
        content={data.content}
        setIsEditing={setIsEditing}
      />
    );
  }

  return (
    <>
      <ActivityCommentContent data-testid="ActivityCommentContent">
        {data.content}
      </ActivityCommentContent>

      <EditCommentActions id={id} setIsEditing={setIsEditing} />
    </>
  );
}
