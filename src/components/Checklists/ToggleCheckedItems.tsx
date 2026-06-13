import { ToggleCheckedItemsButton } from '~/components/Checklists/Checklists.styled';
import { useGetChecklistItems } from '~/query/checklistItems';
import { useGetChecklist, useUpdateChecklist } from '~/query/checklists';

export function ToggleCheckedItems({ checklistId }: { checklistId: string }) {
  const { data: checklist } = useGetChecklist({ checklistId });
  const { data: items } = useGetChecklistItems({ checklistId });
  const { mutate: updateChecklist, isPending } = useUpdateChecklist();

  if (!checklist) return null;

  const completedCount = items?.filter((item) => item.isCompleted).length ?? 0;

  if (completedCount === 0) return null;

  const hideCheckedItems = checklist.hideCheckedItems;
  const label = hideCheckedItems
    ? `Show completed items (${completedCount})`
    : 'Hide completed items';

  return (
    <ToggleCheckedItemsButton
      data-testid="ToggleCheckedItemsButton"
      disabled={isPending}
      onClick={() =>
        updateChecklist({
          checklistId,
          cardId: checklist.cardId,
          hideCheckedItems: !hideCheckedItems,
        })
      }
    >
      {label}
    </ToggleCheckedItemsButton>
  );
}
