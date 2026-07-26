import { Progress } from 'radix-ui';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
import { useGetChecklistItems } from '~/db/checklistItems/checklistItems.query';

export function ChecklistProgress({ checklistId }: { checklistId: string }) {
  const { data } = useGetChecklistItems({ checklistId });
  const completedItems = data?.filter((item) => item.isCompleted);
  const progressPercent = getPercent(data?.length, completedItems?.length);
  const progressFill =
    completedItems?.length === data?.length ? '#5B7F24' : 'black';

  return (
    <div
      className={checklistsStyles.checklistProgressRow}
      data-testid="ChecklistProgressRow"
    >
      <div
        className={checklistItemStyles.checklistLeadingColumn}
        data-testid="ChecklistLeadingColumn"
      >
        <span
          className={checklistsStyles.checklistProgressPercentage}
          data-testid="ChecklistProgressPercentage"
        >
          {`${progressPercent}%`}
        </span>
      </div>

      <div
        className={checklistItemStyles.checklistContentColumn}
        data-testid="ChecklistContentColumn"
      >
        <Progress.Root
          className={checklistsStyles.checklistProgressRoot}
          data-testid="ChecklistProgressRoot"
        >
          <Progress.Indicator
            className={checklistsStyles.checklistProgressIndicator}
            data-testid="ChecklistProgressIndicator"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: progressFill,
            }}
          />
        </Progress.Root>
      </div>
    </div>
  );
}

function getPercent(total?: number, completed?: number) {
  const value = (completed || 0) / (total || 0);
  return Math.round((Number.isNaN(value) ? 0 : value) * 100);
}
