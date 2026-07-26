import { Accordion, Checkbox } from 'radix-ui';
import { css, styled } from 'styled-components';
import { ListCardSkeleton } from '~/components/Lists/List.styled';
import { blue, darkGray, focusRingBlue, fontFamily } from '~/styles/tokens';

const circleSizeDefault = '15px';

type IsCompletedProps = {
  $isCompleted: boolean;
};

export const ListCardTitleDetailsContainer = styled.div<IsCompletedProps>`

  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  word-break: break-word;
  color: ${({ $isCompleted }) => ($isCompleted ? 'rgba(0, 0, 0, 0.5)' : 'inherit')};
`;

type CardCompletedIndicatorCircleProps = {
  $circleSize?: string;
};

export const CardCompletedIndicatorCircle = styled.button<CardCompletedIndicatorCircleProps>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 0;
  height: ${({ $circleSize = circleSizeDefault }) => $circleSize};
  margin-right: 0;
  padding: 0;
  border-radius: 50%;
  border: 1.5px solid ${darkGray};
  background-color: transparent;
  color: #fff;
  opacity: 0;
  overflow: hidden;
  cursor: pointer;
  transition: opacity 250ms ease, width 250ms ease, margin-right 250ms ease, background-color 250ms ease, border-color 250ms ease;
  align-self: center;

  ${({ $circleSize = circleSizeDefault }) =>
    $circleSize &&
    css`
    width: ${$circleSize};
    margin-right: 6px;
    opacity: 1;
  `}

  &[data-visible], &:focus-visible {
    width: ${({ $circleSize = circleSizeDefault }) => $circleSize};
    margin-right: 6px;
    opacity: 1;
  }
  &:focus-visible {
    outline: 2px solid ${focusRingBlue};
    outline-offset: 1px;
  }
  &[data-completed] {
    width: ${({ $circleSize = circleSizeDefault }) => $circleSize};
    margin-right: 6px;
    opacity: 1;
    background-color: #6A9A23;
    border-color: #6A9A23;
  }
`;

type ChecklistTotalsContainerProps = {
  $isOpen: boolean;
  $isAllCompleted: boolean;
};

export const CardTitleDetailsChecklistTotalsContainer = styled.div<ChecklistTotalsContainerProps>`
  
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 2px 0px 0px 2px;
  padding: 2px 4px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: rgba(0, 85, 204, 0.12);
  }
  
  ${({ $isOpen }) =>
    $isOpen &&
    css`
    background-color: rgba(0, 85, 204, 0.12);
    color: #0055cc;
  `}

  ${({ $isAllCompleted }) =>
    $isAllCompleted &&
    css`
    background-color: #5B7F24;
    color: #fff;

    &:hover {
      background-color: #5B7F24;
      cursor: default;
    }
  `}
`;

export const CardTitleDetailsChecklistDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 6px 0 4px;
  background: rgba(9, 30, 66, 0.13);
`;

export const CardTitleDetailsChecklistAccordionRoot = styled(Accordion.Root)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CardTitleDetailsChecklistAccordionItem = styled(Accordion.Item)`
  width: 100%;
`;

export const CardTitleDetailsChecklistAccordionHeader = styled(
  Accordion.Header,
)`
  margin: 0;
`;

export const CardTitleDetailsChecklistAccordionChevron = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: #44546f;
  transition: transform 150ms ease;
`;

export const CardTitleDetailsChecklistAccordionTrigger = styled(
  Accordion.Trigger,
)`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 4px 2px;
  border-radius: 3px;
  font-family: ${fontFamily};
  font-size: 14px;
  line-height: 20px;
  color: #172b4d;
  cursor: pointer;

  &:hover {
    background: rgba(9, 30, 66, 0.08);
  }

  &[data-state='open'] > span:first-of-type {
    transform: rotate(90deg);
  }

  &:focus {
    outline: 2px solid ${focusRingBlue};
    outline-offset: 1px;
    border-radius: 2px;
  }
`;

export const CardTitleDetailsChecklistAccordionTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-size: 12px;
`;

export const CardTitleDetailsChecklistAccordionCount = styled.span`
  flex-shrink: 0;
  color: #44546f;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.07rem;
`;

export const CardTitleDetailsChecklistAccordionContent = styled(
  Accordion.Content,
)`
  overflow: hidden;

  &[data-state='open'] {
    animation: cardTitleChecklistSlideDown 150ms ease-out;
  }

  &[data-state='closed'] {
    animation: cardTitleChecklistSlideUp 150ms ease-out;
  }

  @keyframes cardTitleChecklistSlideDown {
    from {
      height: 0;
    }

    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes cardTitleChecklistSlideUp {
    from {
      height: var(--radix-accordion-content-height);
    }

    to {
      height: 0;
    }
  }
`;

export const CardTitleDetailsChecklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px 0 4px 4px;
  width: stretch;
`;

export const CardTitleDetailsChecklistItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 2px 0;
  font-size: 14px;
  line-height: 20px;
  color: #172b4d;
`;

export const CardTitleDetailsChecklistCheckbox = styled(Checkbox.Root)`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid rgba(9, 30, 66, 0.5);
  background-color: #fff;
  cursor: pointer;

  ${({ checked }) =>
    checked &&
    css`
    background-color: blue;
    border-color: blue;
    color: #fff;
  `}
`;

export const CardTitleDetailsChecklistCheckboxIndicator = styled(
  Checkbox.Indicator,
)`
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardTitleDetailsChecklistItemLabel = styled.span`
  min-width: 0;
  word-break: break-word;
  text-align: left;
  font-size: 12px;
`;

export const CardTitleDetailsChecklistShowMore = styled.button`
  all: unset;
  box-sizing: border-box;
  display: inline-block;
  margin-top: 6px;
  padding: 2px 0;
  font-size: 12px;
  text-decoration: none;
  font-weight: 400;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${focusRingBlue};
    outline-offset: 1px;
    border-radius: 2px;
  }
`;

type CommentsCountProps = {
  $commentsCount: number;
};
export const CardTitleDetailsContentIconsContainer = styled.div<CommentsCountProps>`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-left: ${({ $commentsCount }) => ($commentsCount > 0 ? '2px' : '0')};
`;

export const CardTitleDetailsSpinnerContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.72);
  z-index: 1;
`;

export const CardTitleDetailsSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(9, 30, 66, 0.15);
  border-top-color: ${blue};
  border-radius: 50%;
  animation: cardTitleDetailsSpin 0.6s linear infinite;

  @keyframes cardTitleDetailsSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const CardTitleDetailsContentSkeleton = styled(ListCardSkeleton)`
  width: 50px;
  margin-top: 4px;
`;

export const AllTasksCompletedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px;
  width: stretch;
  animation: allTasksCompletedReveal 250ms ease-out;

  @keyframes allTasksCompletedReveal {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.95);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const AllTasksCompletedText = styled.div`
  min-width: 0;
  word-break: break-word;
  text-align: left;
  font-size: 12px;
`;
