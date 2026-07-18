import type { MouseEvent } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { IoMdList } from 'react-icons/io';
import { RiCheckboxLine } from 'react-icons/ri';
import {
  CardTitleDetailsChecklistTotalsContainer,
  CardTitleDetailsContentIconsContainer,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useGetCardTitleDetailsChecklists } from '~/db/checklists/checklists.query';
import { Flex } from '~/styles/Page.styled';
import { useCardTitleDetailsVisibility } from '~/utils/useCardTitleDetailsVisibility';

type CardTitleDetailsContentIconsProps = {
  cardId: string;
  description: string;
  isOpen: boolean;
  toggleOpen: (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
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
    <CardTitleDetailsContentIconsContainer
      data-testid="CardTitleDetailsContentIconsContainer"
      commentsCount={commentsCount}
    >
      {commentsCount > 0 && (
        <Tooltip content="Comments">
          <Flex style={{ fontSize: '12px', lineHeight: '16px', gap: '4px' }}>
            <BiCommentDetail
              size={15}
              data-testid="BiCommentDetail"
              style={{ position: 'relative', top: '1px' }}
            />
            {commentsCount}
          </Flex>
        </Tooltip>
      )}

      {description && (
        <Tooltip content="Description">
          <Flex style={{ fontSize: '12px', lineHeight: '16px', gap: '4px' }}>
            <IoMdList size={15} />
          </Flex>
        </Tooltip>
      )}

      {hasChecklistDetails && (
        <Tooltip content={checklistTooltipText}>
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
      )}
    </CardTitleDetailsContentIconsContainer>
  );
}
