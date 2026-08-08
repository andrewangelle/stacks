import {
  CheckboxSkeleton,
  ChecklistLabelSkeleton,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { CardTitleDetailsChecklistContainer } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';

export function CardTitleDetailsChecklistFallback() {
  return (
    <CardTitleDetailsChecklistContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <CheckboxSkeleton />
        <ChecklistLabelSkeleton style={{ width: '83%' }} />
      </div>
    </CardTitleDetailsChecklistContainer>
  );
}
