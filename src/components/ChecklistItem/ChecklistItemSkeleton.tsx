import * as styles from '~/components/ChecklistItem/ChecklistItem.css';

export function ChecklistItemSkeleton() {
  return (
    <div
      className={styles.checklistCheckboxContainer}
      data-testid="ChecklistCheckboxContainer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '8px 0px',
      }}
    >
      <div className={styles.checkboxSkeleton} data-testid="CheckboxSkeleton" />
      <div
        className={styles.checklistLabelSkeleton}
        data-testid="ChecklistLabelSkeleton"
        style={{ width: '90%', marginLeft: '12px' }}
      />
    </div>
  );
}
