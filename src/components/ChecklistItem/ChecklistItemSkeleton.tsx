import {
  CheckboxSkeleton,
  ChecklistCheckboxContainer,
  ChecklistLabelSkeleton,
} from '~/components/ChecklistItem/ChecklistItem.styled';

export function ChecklistItemSkeleton() {
  return (
    <ChecklistCheckboxContainer data-testid="ChecklistCheckboxContainer">
      <CheckboxSkeleton data-testid="CheckboxSkeleton" />
      <ChecklistLabelSkeleton data-testid="ChecklistLabelSkeleton" />
    </ChecklistCheckboxContainer>
  );
}
