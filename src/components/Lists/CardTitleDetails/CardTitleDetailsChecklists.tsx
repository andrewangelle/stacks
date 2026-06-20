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
import { Tooltip } from '~/components/Tooltip/Tooltip';
import { useGetCardTitleDetailsChecklists } from '~/db/checklists/checklists.query';

const MAX_VISIBLE_CHECKLISTS = 3;

type CardTitleDetailsChecklistDetailsProps = {
  cardId: string;
  onShowMore: (checklistId: string) => void;
};

export function CardTitleDetailsChecklists({
  cardId,
  onShowMore,
}: CardTitleDetailsChecklistDetailsProps) {
  const { data } = useGetCardTitleDetailsChecklists({
    cardId,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [openChecklistId, setOpenChecklistId] = useState('');

  const checklists = data?.checklists ?? [];
  const visibleChecklists = checklists.slice(0, MAX_VISIBLE_CHECKLISTS);
  const truncatedCount = checklists.length - MAX_VISIBLE_CHECKLISTS;
  const accordionValue =
    openChecklistId &&
    checklists.some((checklist) => checklist.id === openChecklistId)
      ? openChecklistId
      : '';

  const tooltipText = data?.isAllCompleted
    ? 'Checklist items'
    : isOpen
      ? 'Collapse checklists'
      : 'Expand checklists';

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
      <Tooltip content={tooltipText}>
        <CardTitleDetailsChecklistTotalsContainer
          data-testid="CardTitleDetailsChecklistTotalsContainer"
          isAllCompleted={data?.isAllCompleted ?? false}
          isOpen={isOpen}
          onClick={toggleOpen}
        >
          <RiCheckboxLine size={14} />
          {data?.completedItemsForCard} / {data?.totalItemsForCard}
        </CardTitleDetailsChecklistTotalsContainer>
      </Tooltip>

      {isOpen && checklists.length > 0 && (
        <>
          <CardTitleDetailsChecklistDivider data-testid="CardTitleDetailsChecklistDivider" />

          {data?.hasMultiple && (
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

          {data?.hasMultiple && truncatedCount > 0 && (
            <CardTitleDetailsChecklistShowMore
              data-testid="CardTitleDetailsChecklistShowMore"
              onClick={handleShowMore}
              type="button"
            >
              ...and {truncatedCount} more
            </CardTitleDetailsChecklistShowMore>
          )}

          {!data?.hasMultiple && data?.singleChecklistId && (
            <CardTitleDetailsChecklist
              checklistId={data?.singleChecklistId}
              collapsible
            />
          )}
        </>
      )}
    </>
  );
}
