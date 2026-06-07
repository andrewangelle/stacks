import { type MouseEvent, useState } from 'react';
import { RiCheckboxLine } from 'react-icons/ri';
import {
  CardTitleDetailsChecklistAccordionRoot,
  CardTitleDetailsChecklistDivider,
  CardTitleDetailsChecklistTotalsContainer,
} from '~/components/Cards/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsChecklist } from '~/components/Cards/CardTitleDetails/CardTitleDetailsChecklist';
import { CardTitleDetailsChecklistAccordion } from '~/components/Cards/CardTitleDetails/CardTitleDetailsChecklistAccordion';
import { useGetCardChecklistView } from '~/query/checklists';

type CardTitleDetailsChecklistDetailsProps = {
  cardId: string;
};

export function CardTitleDetailsChecklists({
  cardId,
}: CardTitleDetailsChecklistDetailsProps) {
  const { data: checklistViews } = useGetCardChecklistView({
    cardId,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [openChecklistId, setOpenChecklistId] = useState('');

  const checklists = checklistViews?.checklists ?? [];
  const accordionValue =
    openChecklistId &&
    checklists.some((checklist) => checklist.id === openChecklistId)
      ? openChecklistId
      : '';

  function toggleOpen(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <CardTitleDetailsChecklistTotalsContainer
        data-testid="CardTitleDetailsChecklistTotalsContainer"
        isAllCompleted={checklistViews?.isAllCompleted ?? false}
        isOpen={isOpen}
        onClick={toggleOpen}
      >
        <RiCheckboxLine size={14} />
        {checklistViews?.completedItemsForCard} /{' '}
        {checklistViews?.totalItemsForCard}
      </CardTitleDetailsChecklistTotalsContainer>

      {isOpen && checklists.length > 0 && (
        <>
          <CardTitleDetailsChecklistDivider data-testid="CardTitleDetailsChecklistDivider" />

          {checklistViews?.hasMultiple && (
            <CardTitleDetailsChecklistAccordionRoot
              collapsible
              data-testid="CardTitleDetailsChecklistAccordion"
              onValueChange={(value: string) => setOpenChecklistId(value)}
              type="single"
              value={accordionValue}
            >
              {checklists.map((checklist) => (
                <CardTitleDetailsChecklistAccordion
                  key={checklist.id}
                  checklistId={checklist.id}
                  cardId={cardId}
                />
              ))}
            </CardTitleDetailsChecklistAccordionRoot>
          )}

          {!checklistViews?.hasMultiple &&
            checklistViews?.singleChecklistId && (
              <CardTitleDetailsChecklist
                checklistId={checklistViews?.singleChecklistId}
              />
            )}
        </>
      )}
    </>
  );
}
