import {
  CheckboxSkeleton,
  ChecklistLabelSkeleton,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { CardTitleDetailsChecklistContainer } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';

export function CardTitleDetailsChecklistFallback() {
  return (
    <CardTitleDetailsChecklistContainer data-testid="CardTitleDetailsChecklistContainer">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <CheckboxSkeleton data-testid="CheckboxSkeleton" />
        <ChecklistLabelSkeleton
          data-testid="ChecklistLabelSkeleton"
          style={{ width: '83%' }}
        />
      </div>
    </CardTitleDetailsChecklistContainer>
  );
}
