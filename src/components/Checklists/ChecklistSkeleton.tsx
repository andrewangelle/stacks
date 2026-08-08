import { BsCheck2Square } from 'react-icons/bs';
import {
  ChecklistContentColumn,
  ChecklistLeadingColumn,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistContainer,
  ChecklistHeader,
  ChecklistNameSkeleton,
  ChecklistNameSkeletonContainer,
  ChecklistProgressRow,
  ChecklistProgressSkeleton,
  DeleteChecklistSkeleton,
} from '~/components/Checklists/Checklists.styled';

export function ChecklistSkeleton() {
  return (
    <ChecklistContainer>
      <ChecklistHeader>
        <ChecklistNameSkeletonContainer>
          <BsCheck2Square size={24} />
          <ChecklistNameSkeleton />
        </ChecklistNameSkeletonContainer>
        <DeleteChecklistSkeleton />
      </ChecklistHeader>

      <ChecklistProgressRow>
        <ChecklistLeadingColumn>
          <ChecklistProgressSkeleton />
        </ChecklistLeadingColumn>

        <ChecklistContentColumn>
          <ChecklistProgressSkeleton style={{ marginLeft: '8px' }} />
        </ChecklistContentColumn>
      </ChecklistProgressRow>
    </ChecklistContainer>
  );
}
