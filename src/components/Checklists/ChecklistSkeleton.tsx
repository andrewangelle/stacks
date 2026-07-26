import { BsCheck2Square } from 'react-icons/bs';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';

export function ChecklistSkeleton() {
  return (
    <div
      className={checklistsStyles.checklistContainer}
      data-testid="ChecklistContainer"
    >
      <div
        className={checklistsStyles.checklistHeader}
        data-testid="ChecklistHeader"
      >
        <div
          className={checklistsStyles.checklistNameSkeletonContainer}
          data-testid="ChecklistNameSkeletonContainer"
        >
          <BsCheck2Square size={24} />
          <div
            className={checklistsStyles.checklistNameSkeleton}
            data-testid="ChecklistNameSkeleton"
          />
        </div>
        <div
          className={checklistsStyles.deleteChecklistSkeleton}
          data-testid="DeleteChecklistSkeleton"
        />
      </div>

      <div
        className={checklistsStyles.checklistProgressRow}
        data-testid="ChecklistProgressRow"
      >
        <div
          className={checklistItemStyles.checklistLeadingColumn}
          data-testid="ChecklistLeadingColumn"
        >
          <div
            className={checklistsStyles.checklistProgressSkeleton}
            data-testid="ChecklistProgressSkeleton"
          />
        </div>

        <div
          className={checklistItemStyles.checklistContentColumn}
          data-testid="ChecklistContentColumn"
        >
          <div
            className={checklistsStyles.checklistProgressSkeleton}
            data-testid="ChecklistProgressSkeleton"
            style={{ marginLeft: '8px' }}
          />
        </div>
      </div>
    </div>
  );
}
