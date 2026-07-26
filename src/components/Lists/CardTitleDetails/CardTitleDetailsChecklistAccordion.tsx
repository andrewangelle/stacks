import { Accordion } from 'radix-ui';
import { Suspense } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import * as styles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';
import { CardTitleDetailsChecklist } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklist';
import { CardTitleDetailsChecklistFallback } from '~/components/Lists/CardTitleDetails/CardTitleDetailsChecklistFallback';
import { useGetCardTitleDetailsChecklists } from '~/db/checklists/checklists.query';

type CardTitleDetailsChecklistAccordionProps = {
  cardId: string;
  checklistId: string;
};

export function CardTitleDetailsChecklistAccordion({
  cardId,
  checklistId,
}: CardTitleDetailsChecklistAccordionProps) {
  const { data: checklistViews } = useGetCardTitleDetailsChecklists({
    cardId,
  });
  const checklist = checklistViews?.checklists.find(
    (checklist) => checklist.id === checklistId,
  );

  if (!checklist) return null;
  return (
    <Accordion.Item
      className={styles.cardTitleDetailsChecklistAccordionItem}
      data-testid="CardTitleDetailsChecklistAccordionItem"
      key={checklist.id}
      value={checklist.id}
    >
      <Accordion.Header
        className={styles.cardTitleDetailsChecklistAccordionHeader}
        data-testid="CardTitleDetailsChecklistAccordionHeader"
      >
        <Accordion.Trigger
          className={styles.cardTitleDetailsChecklistAccordionTrigger}
          data-testid="CardTitleDetailsChecklistAccordionTrigger"
          onClick={(event) => event.stopPropagation()}
        >
          <span
            className={styles.cardTitleDetailsChecklistAccordionChevron}
            data-testid="CardTitleDetailsChecklistAccordionChevron"
          >
            <RiArrowRightSLine size={16} />
          </span>

          <span
            className={styles.cardTitleDetailsChecklistAccordionTitle}
            data-testid="CardTitleDetailsChecklistAccordionTitle"
          >
            {checklist.checklistTitle}
          </span>

          <span
            className={styles.cardTitleDetailsChecklistAccordionCount}
            data-testid="CardTitleDetailsChecklistAccordionCount"
          >
            {checklist.completedItems}/{checklist.totalItems}
          </span>
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content
        className={styles.cardTitleDetailsChecklistAccordionContent}
        data-testid="CardTitleDetailsChecklistAccordionContent"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <Suspense fallback={<CardTitleDetailsChecklistFallback />}>
          <CardTitleDetailsChecklist checklistId={checklist.id} collapsible />
        </Suspense>
      </Accordion.Content>
    </Accordion.Item>
  );
}
