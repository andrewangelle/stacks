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
    <ChecklistContainer data-testid="ChecklistContainer">
      <ChecklistHeader data-testid="ChecklistHeader">
        <ChecklistNameSkeletonContainer data-testid="ChecklistNameSkeletonContainer">
          <BsCheck2Square size={24} />
          <ChecklistNameSkeleton data-testid="ChecklistNameSkeleton" />
        </ChecklistNameSkeletonContainer>
        <DeleteChecklistSkeleton data-testid="DeleteChecklistSkeleton" />
      </ChecklistHeader>

      <ChecklistProgressRow data-testid="ChecklistProgressRow">
        <ChecklistLeadingColumn data-testid="ChecklistLeadingColumn">
          <ChecklistProgressSkeleton data-testid="ChecklistProgressSkeleton" />
        </ChecklistLeadingColumn>

        <ChecklistContentColumn data-testid="ChecklistContentColumn">
          <ChecklistProgressSkeleton
            data-testid="ChecklistProgressSkeleton"
            style={{ marginLeft: '8px' }}
          />
        </ChecklistContentColumn>
      </ChecklistProgressRow>
    </ChecklistContainer>
  );
}
