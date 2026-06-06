import { type MouseEvent, useState } from 'react';
import { RiArrowRightSLine, RiCheckboxLine } from 'react-icons/ri';
import { CardTitleChecklistItemRows } from '~/components/Cards/CardTitleDetails/CardTitleChecklistItemRows';
import {
  CardTitleChecklistAccordion,
  CardTitleChecklistAccordionChevron,
  CardTitleChecklistAccordionContent,
  CardTitleChecklistAccordionCount,
  CardTitleChecklistAccordionHeader,
  CardTitleChecklistAccordionItem,
  CardTitleChecklistAccordionTitle,
  CardTitleChecklistAccordionTrigger,
  CardTitleChecklistDivider,
  CardTitleChecklistTotalsContainer,
} from '~/components/Cards/CardTitleDetails/CardTitleDetails.styled';
import type { useGetCardChecklistView } from '~/query/checklists';

type CardChecklistView = NonNullable<
  ReturnType<typeof useGetCardChecklistView>['data']
>;

type CardTitleChecklistDetailsProps = {
  checklistViews: CardChecklistView;
};

export function CardTitleChecklistDetails({
  checklistViews,
}: CardTitleChecklistDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openChecklistId, setOpenChecklistId] = useState('');

  const incompleteChecklists = checklistViews.checklists.filter(
    (checklist) => checklist.completedItems < checklist.totalItems,
  );

  const hasMultipleIncomplete = incompleteChecklists.length > 1;

  const accordionValue =
    openChecklistId &&
    incompleteChecklists.some((checklist) => checklist.id === openChecklistId)
      ? openChecklistId
      : '';

  const singleChecklistId = incompleteChecklists[0]?.id;

  const isAllCompleted =
    checklistViews.completedItemsForCard === checklistViews.totalItemsForCard;

  function toggleOpen(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <CardTitleChecklistTotalsContainer
        data-testid="CardTitleChecklistTotalsContainer"
        isAllCompleted={isAllCompleted}
        isOpen={isOpen}
        onClick={toggleOpen}
      >
        <RiCheckboxLine size={14} />
        {checklistViews.completedItemsForCard} /{' '}
        {checklistViews.totalItemsForCard}
      </CardTitleChecklistTotalsContainer>

      {isOpen && incompleteChecklists.length > 0 && (
        <>
          <CardTitleChecklistDivider data-testid="CardTitleChecklistDivider" />

          {hasMultipleIncomplete && (
            <CardTitleChecklistAccordion
              collapsible
              data-testid="CardTitleChecklistAccordion"
              onValueChange={(value: string) => setOpenChecklistId(value)}
              type="single"
              value={accordionValue}
            >
              {incompleteChecklists.map((checklist) => (
                <CardTitleChecklistAccordionItem
                  data-testid="CardTitleChecklistAccordionItem"
                  key={checklist.id}
                  value={checklist.id}
                >
                  <CardTitleChecklistAccordionHeader data-testid="CardTitleChecklistAccordionHeader">
                    <CardTitleChecklistAccordionTrigger
                      data-testid="CardTitleChecklistAccordionTrigger"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <CardTitleChecklistAccordionChevron data-testid="CardTitleChecklistAccordionChevron">
                        <RiArrowRightSLine size={16} />
                      </CardTitleChecklistAccordionChevron>

                      <CardTitleChecklistAccordionTitle data-testid="CardTitleChecklistAccordionTitle">
                        {checklist.checklistTitle}
                      </CardTitleChecklistAccordionTitle>

                      <CardTitleChecklistAccordionCount data-testid="CardTitleChecklistAccordionCount">
                        {checklist.completedItems}/{checklist.totalItems}
                      </CardTitleChecklistAccordionCount>
                    </CardTitleChecklistAccordionTrigger>
                  </CardTitleChecklistAccordionHeader>

                  <CardTitleChecklistAccordionContent
                    data-testid="CardTitleChecklistAccordionContent"
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <CardTitleChecklistItemRows checklistId={checklist.id} />
                  </CardTitleChecklistAccordionContent>
                </CardTitleChecklistAccordionItem>
              ))}
            </CardTitleChecklistAccordion>
          )}

          {!hasMultipleIncomplete && singleChecklistId && (
            <CardTitleChecklistItemRows checklistId={singleChecklistId} />
          )}
        </>
      )}
    </>
  );
}
