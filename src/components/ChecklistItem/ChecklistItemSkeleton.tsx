import {
  CheckboxSkeleton,
  ChecklistCheckboxContainer,
  ChecklistLabelSkeleton,
} from '~/components/ChecklistItem/ChecklistItem.styled';

export function ChecklistItemSkeleton() {
  return (
    <ChecklistCheckboxContainer
      data-testid="ChecklistCheckboxContainer"
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      <CheckboxSkeleton data-testid="CheckboxSkeleton" />
      <ChecklistLabelSkeleton
        data-testid="ChecklistLabelSkeleton"
        style={{ width: '90%', marginLeft: '12px' }}
      />
    </ChecklistCheckboxContainer>
  );
}
