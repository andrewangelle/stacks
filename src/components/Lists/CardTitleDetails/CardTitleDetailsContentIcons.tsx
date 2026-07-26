import type { KeyboardEvent, MouseEvent } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { IoMdList } from 'react-icons/io';
import { RiCheckboxLine } from 'react-icons/ri';
import * as cardTitleDetailsStyles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useGetCardTitleDetailsChecklists } from '~/db/checklists/checklists.query';
import * as pageStyles from '~/styles/Page.css';
import { useCardTitleDetailsVisibility } from '~/utils/useCardTitleDetailsVisibility';

type CardTitleDetailsContentIconsProps = {
  cardId: string;
  description: string;
  isOpen: boolean;
  toggleOpen: (
    event:
      | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | KeyboardEvent<HTMLDivElement>,
  ) => void;
};

export function CardTitleDetailsContentIcons({
  cardId,
  description,
  isOpen,
  toggleOpen,
}: CardTitleDetailsContentIconsProps) {
  const { data } = useGetCardTitleDetailsChecklists({ cardId });
  const { commentsCount, hasChecklistDetails } =
    useCardTitleDetailsVisibility(cardId);

  const checklistTooltipText = data?.isAllCompleted
    ? 'Checklist items'
    : isOpen
      ? 'Collapse checklists'
      : 'Expand checklists';

  return (
    <div
      className={cardTitleDetailsStyles.cardTitleDetailsContentIconsContainer({
        hasComments: commentsCount > 0,
      })}
      data-testid="CardTitleDetailsContentIconsContainer"
    >
      {commentsCount > 0 && (
        <Tooltip content="Comments">
          <div
            className={pageStyles.flex}
            style={{ fontSize: '12px', lineHeight: '16px', gap: '4px' }}
          >
            <BiCommentDetail
              size={15}
              data-testid="BiCommentDetail"
              style={{ position: 'relative', top: '1px' }}
            />
            {commentsCount}
          </div>
        </Tooltip>
      )}

      {description && (
        <Tooltip content="Description">
          <div
            className={pageStyles.flex}
            style={{ fontSize: '12px', lineHeight: '16px', gap: '4px' }}
          >
            <IoMdList size={15} />
          </div>
        </Tooltip>
      )}

      {hasChecklistDetails && (
        <Tooltip content={checklistTooltipText}>
          {/* biome-ignore lint/a11y/useSemanticElements: <style conflict> */}
          <div
            role="button"
            tabIndex={data?.isAllCompleted ? -1 : 0}
            className={cardTitleDetailsStyles.cardTitleDetailsChecklistTotalsContainer(
              { isOpen, isAllCompleted: data?.isAllCompleted ?? false },
            )}
            data-testid="CardTitleDetailsChecklistTotalsContainer"
            onClick={toggleOpen}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                toggleOpen(event);
              }
            }}
          >
            <RiCheckboxLine size={14} />
            {data?.completedItemsForCard} / {data?.totalItemsForCard}
          </div>
        </Tooltip>
      )}
    </div>
  );
}
