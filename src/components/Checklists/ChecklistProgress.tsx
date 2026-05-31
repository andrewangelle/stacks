import {
  ChecklistContentColumn,
  ChecklistLeadingColumn,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistProgressIndicator,
  ChecklistProgressPercentage,
  ChecklistProgressRoot,
  ChecklistProgressRow,
} from '~/components/Checklists/Checklists.styled';
import { useGetChecklistItems } from '~/query/checklistItems';

export function ChecklistProgress({ checklistId }: { checklistId: string }) {
  const { data } = useGetChecklistItems({ checklistId });
  const completedItems = data?.filter((item) => item.isCompleted);
  const progressPercent = getPercent(data?.length, completedItems?.length);

  return (
    <ChecklistProgressRow data-testid="ChecklistProgressRow">
      <ChecklistLeadingColumn data-testid="ChecklistLeadingColumn">
        <ChecklistProgressPercentage data-testid="ChecklistProgressPercentage">
          {`${progressPercent}%`}
        </ChecklistProgressPercentage>
      </ChecklistLeadingColumn>

      <ChecklistContentColumn data-testid="ChecklistContentColumn">
        <ChecklistProgressRoot data-testid="ChecklistProgressRoot">
          <ChecklistProgressIndicator
            data-testid="ChecklistProgressIndicator"
            style={{ width: `${progressPercent}%` }}
          />
        </ChecklistProgressRoot>
      </ChecklistContentColumn>
    </ChecklistProgressRow>
  );
}

function getPercent(total?: number, completed?: number) {
  const value = (completed || 0) / (total || 0);
  return Math.round((Number.isNaN(value) ? 0 : value) * 100);
}
