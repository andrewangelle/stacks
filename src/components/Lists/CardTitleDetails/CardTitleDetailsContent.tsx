import { type MouseEvent, Suspense, useState } from 'react';
import {
  CardTitleDetailsChecklistAccordionRoot,
  CardTitleDetailsChecklistDivider,
  CardTitleDetailsChecklistShowMore,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsChecklist } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklist';
import { CardTitleDetailsChecklistAccordion } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklistAccordion';
import { CardTitleDetailsChecklistFallback } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklistFallback';
import { CardTitleDetailsContentTriggers } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContentTriggers';
import { useGetCardTitleDetailsChecklists } from '~/db/checklists/checklists.query';
import { useCardTitleDetailsVisibility } from '~/utils/useCardTitleDetailsVisibility';

const MAX_VISIBLE_CHECKLISTS = 3;

type CardTitleDetailsContentProps = {
  cardId: string;
  onShowMore: (checklistId: string) => void;
};

export function CardTitleDetailsContent({
  cardId,
  onShowMore,
}: CardTitleDetailsContentProps) {
  const { hasDetailInfo } = useCardTitleDetailsVisibility(cardId);
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

  if (!hasDetailInfo) {
    return null;
  }

  return (
    <>
      <CardTitleDetailsContentTriggers
        cardId={cardId}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

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
            <Suspense fallback={<CardTitleDetailsChecklistFallback />}>
              <CardTitleDetailsChecklist
                checklistId={data?.singleChecklistId}
                collapsible
              />
            </Suspense>
          )}
        </>
      )}
    </>
  );
}
