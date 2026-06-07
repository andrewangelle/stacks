import { RiArrowRightSLine } from 'react-icons/ri';
import {
  CardTitleDetailsChecklistAccordionChevron,
  CardTitleDetailsChecklistAccordionContent,
  CardTitleDetailsChecklistAccordionCount,
  CardTitleDetailsChecklistAccordionHeader,
  CardTitleDetailsChecklistAccordionItem,
  CardTitleDetailsChecklistAccordionTitle,
  CardTitleDetailsChecklistAccordionTrigger,
} from '~/components/Cards/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsChecklist } from '~/components/Cards/CardTitleDetails/CardTitleDetailsChecklist';
import { useGetCardChecklistView } from '~/query/checklists';

type CardTitleDetailsChecklistAccordionProps = {
  cardId: string;
  checklistId: string;
};

export function CardTitleDetailsChecklistAccordion({
  cardId,
  checklistId,
}: CardTitleDetailsChecklistAccordionProps) {
  const { data: checklistViews } = useGetCardChecklistView({
    cardId,
  });
  const checklist = checklistViews?.checklists.find(
    (checklist) => checklist.id === checklistId,
  );

  if (!checklist) return null;
  return (
    <CardTitleDetailsChecklistAccordionItem
      data-testid="CardTitleDetailsChecklistAccordionItem"
      key={checklist.id}
      value={checklist.id}
    >
      <CardTitleDetailsChecklistAccordionHeader data-testid="CardTitleDetailsChecklistAccordionHeader">
        <CardTitleDetailsChecklistAccordionTrigger
          data-testid="CardTitleDetailsChecklistAccordionTrigger"
          onClick={(event) => event.stopPropagation()}
        >
          <CardTitleDetailsChecklistAccordionChevron data-testid="CardTitleDetailsChecklistAccordionChevron">
            <RiArrowRightSLine size={16} />
          </CardTitleDetailsChecklistAccordionChevron>

          <CardTitleDetailsChecklistAccordionTitle data-testid="CardTitleDetailsChecklistAccordionTitle">
            {checklist.checklistTitle}
          </CardTitleDetailsChecklistAccordionTitle>

          <CardTitleDetailsChecklistAccordionCount data-testid="CardTitleDetailsChecklistAccordionCount">
            {checklist.completedItems}/{checklist.totalItems}
          </CardTitleDetailsChecklistAccordionCount>
        </CardTitleDetailsChecklistAccordionTrigger>
      </CardTitleDetailsChecklistAccordionHeader>

      <CardTitleDetailsChecklistAccordionContent
        data-testid="CardTitleDetailsChecklistAccordionContent"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <CardTitleDetailsChecklist checklistId={checklist.id} />
      </CardTitleDetailsChecklistAccordionContent>
    </CardTitleDetailsChecklistAccordionItem>
  );
}
