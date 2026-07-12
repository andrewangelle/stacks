import { type MouseEvent, Suspense, useEffect, useState } from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import {
  AllTasksCompletedContainer,
  AllTasksCompletedText,
  CardTitleDetailsChecklistAccordionRoot,
  CardTitleDetailsChecklistDivider,
  CardTitleDetailsChecklistShowMore,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsChecklist } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklist';
import { CardTitleDetailsChecklistAccordion } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklistAccordion';
import { CardTitleDetailsChecklistFallback } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklistFallback';
import { CardTitleDetailsContentIcons } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContentIcons';
import {
  useGetCardTitleDetailsChecklists,
  useSetCardChecklistExpanded,
} from '~/db/checklists/checklists.query';
import { useCardTitleDetailsVisibility } from '~/utils/useCardTitleDetailsVisibility';

const MAX_VISIBLE_CHECKLISTS = 3;

type CardTitleDetailsContentProps = {
  cardId: string;
  description: string;
  onShowMore: (checklistId: string) => void;
};

export function CardTitleDetailsContent({
  cardId,
  description,
  onShowMore,
}: CardTitleDetailsContentProps) {
  const { hasDetailInfo } = useCardTitleDetailsVisibility(cardId);
  const { data } = useGetCardTitleDetailsChecklists({
    cardId,
  });
  const { mutate: setChecklistExpanded } = useSetCardChecklistExpanded();
  const [showAllCompleteView, setShowAllCompleteView] = useState(false);

  const isOpen = data?.isChecklistsExpanded ?? false;
  const checklists = data?.checklists ?? [];
  const visibleChecklists = checklists.slice(0, MAX_VISIBLE_CHECKLISTS);
  const truncatedCount = checklists.length - MAX_VISIBLE_CHECKLISTS;
  const expandedChecklistId = data?.expandedChecklistId ?? '';
  const accordionValue =
    expandedChecklistId &&
    checklists.some((checklist) => checklist.id === expandedChecklistId)
      ? expandedChecklistId
      : '';

  function toggleOpen(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setChecklistExpanded({ cardId, isChecklistsExpanded: !isOpen });
  }

  function handleShowMore(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const firstHiddenChecklist = checklists[MAX_VISIBLE_CHECKLISTS];
    if (firstHiddenChecklist) {
      onShowMore(firstHiddenChecklist.id);
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showAllCompleteView) {
      timer = setTimeout(() => {
        setShowAllCompleteView(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showAllCompleteView]);

  if (!hasDetailInfo && !description) {
    return null;
  }

  return (
    <>
      <CardTitleDetailsContentIcons
        cardId={cardId}
        description={description}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      {showAllCompleteView && (
        <AllTasksCompletedContainer data-testid="AllTasksCompletedContainer">
          <IoIosCheckmarkCircleOutline
            size={24}
            color="#6A9A23"
            strokeWidth={12}
          />

          <AllTasksCompletedText data-testid="CardTitleDetailsChecklistItemLabel">
            All tasks completed!
          </AllTasksCompletedText>
        </AllTasksCompletedContainer>
      )}

      {isOpen && checklists.length > 0 && (
        <>
          <CardTitleDetailsChecklistDivider data-testid="CardTitleDetailsChecklistDivider" />

          {data?.hasMultiple && (
            <CardTitleDetailsChecklistAccordionRoot
              collapsible
              data-testid="CardTitleDetailsChecklistAccordion"
              onValueChange={(value: string) =>
                setChecklistExpanded({
                  cardId,
                  expandedChecklistId: value || null,
                })
              }
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
                isSingleView
                checklistId={data?.singleChecklistId}
                collapsible
                onCompleteAllItems={() => setShowAllCompleteView(true)}
              />
            </Suspense>
          )}
        </>
      )}
    </>
  );
}
