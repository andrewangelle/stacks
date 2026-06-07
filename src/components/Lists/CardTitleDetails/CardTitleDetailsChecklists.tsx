import { type MouseEvent, useState } from 'react';
import { RiCheckboxLine } from 'react-icons/ri';
import {
  CardTitleDetailsChecklistAccordionRoot,
  CardTitleDetailsChecklistDivider,
  CardTitleDetailsChecklistShowMore,
  CardTitleDetailsChecklistTotalsContainer,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsChecklist } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklist';
import { CardTitleDetailsChecklistAccordion } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklistAccordion';
import { useGetCardChecklistView } from '~/query/checklists';

const MAX_VISIBLE_CHECKLISTS = 3;

type CardTitleDetailsChecklistDetailsProps = {
  cardId: string;
  onShowMore: (checklistId: string) => void;
};

export function CardTitleDetailsChecklists({
  cardId,
  onShowMore,
}: CardTitleDetailsChecklistDetailsProps) {
  const { data: checklistViews } = useGetCardChecklistView({
    cardId,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [openChecklistId, setOpenChecklistId] = useState('');

  const checklists = checklistViews?.checklists ?? [];
  const visibleChecklists = checklists.slice(0, MAX_VISIBLE_CHECKLISTS);
  const hiddenChecklistCount = checklists.length - MAX_VISIBLE_CHECKLISTS;
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

  function handleShowMore(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const firstHiddenChecklist = checklists[MAX_VISIBLE_CHECKLISTS];
    if (firstHiddenChecklist) {
      onShowMore(firstHiddenChecklist.id);
    }
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
              {visibleChecklists.map((checklist) => (
                <CardTitleDetailsChecklistAccordion
                  key={checklist.id}
                  checklistId={checklist.id}
                  cardId={cardId}
                />
              ))}
            </CardTitleDetailsChecklistAccordionRoot>
          )}

          {checklistViews?.hasMultiple && hiddenChecklistCount > 0 && (
            <CardTitleDetailsChecklistShowMore
              data-testid="CardTitleDetailsChecklistShowMore"
              onClick={handleShowMore}
              type="button"
            >
              ...and {hiddenChecklistCount} more
            </CardTitleDetailsChecklistShowMore>
          )}

          {!checklistViews?.hasMultiple &&
            checklistViews?.singleChecklistId && (
              <CardTitleDetailsChecklist
                checklistId={checklistViews?.singleChecklistId}
                collapsible
              />
            )}
        </>
      )}
    </>
  );
}
