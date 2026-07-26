import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import * as cardTitleDetailsStyles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';

export function CardTitleDetailsChecklistFallback() {
  return (
    <div
      className={cardTitleDetailsStyles.cardTitleDetailsChecklistContainer}
      data-testid="CardTitleDetailsChecklistContainer"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          className={checklistItemStyles.checkboxSkeleton}
          data-testid="CheckboxSkeleton"
        />
        <div
          className={checklistItemStyles.checklistLabelSkeleton}
          data-testid="ChecklistLabelSkeleton"
          style={{ width: '83%' }}
        />
      </div>
    </div>
  );
}
