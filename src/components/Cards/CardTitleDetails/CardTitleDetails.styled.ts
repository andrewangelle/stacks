import { styled } from '@pigment-css/react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Checkbox from '@radix-ui/react-checkbox';
import {
  checklistProgressBlue,
  completedGreen,
  darkGray,
  focusRingBlue,
  fontFamily,
} from '~/styles/tokens';

const circleSizeDefault = '15px';

export const CardTitleModalTriggerText = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  word-break: break-word;
`;

type CardCompletedIndicatorCircleProps = {
  circleSize?: string;
};

export const CardCompletedIndicatorCircle = styled(
  'button',
)<CardCompletedIndicatorCircleProps>({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: 0,
  height: ({ circleSize = circleSizeDefault }) => circleSize,
  marginRight: 0,
  padding: 0,
  borderRadius: '50%',
  border: `1.5px solid ${darkGray}`,
  backgroundColor: 'transparent',
  color: '#fff',
  opacity: 0,
  overflow: 'hidden',
  cursor: 'pointer',
  transition:
    'opacity 250ms ease, width 250ms ease, margin-right 250ms ease, background-color 250ms ease, border-color 250ms ease',

  alignSelf: 'center',

  // Reveal on hover/focus of the card (data-visible) or when this control
  // itself receives keyboard focus.
  '&[data-visible], &:focus-visible': {
    width: ({ circleSize = circleSizeDefault }) => circleSize,
    marginRight: '6px',
    opacity: 1,
  },

  '&:focus-visible': {
    outline: `2px solid ${focusRingBlue}`,
    outlineOffset: '1px',
  },

  '&[data-completed]': {
    width: ({ circleSize = circleSizeDefault }) => circleSize,
    marginRight: '6px',
    opacity: 1,
    backgroundColor: completedGreen,
    borderColor: completedGreen,
  },
});

type ChecklistTotalsContainerProps = {
  isOpen: boolean;
  isAllCompleted: boolean;
};

export const CardTitleChecklistTotalsContainer =
  styled.div<ChecklistTotalsContainerProps>({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    margin: '2px 0px 0px 2px',
    padding: '2px 4px 2px 3px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '16px',
    cursor: 'pointer',
    userSelect: 'none',

    '&:hover': {
      backgroundColor: 'rgba(0, 85, 204, 0.12)',
    },

    variants: [
      {
        props: { isOpen: true },
        style: {
          backgroundColor: 'rgba(0, 85, 204, 0.12)',
          color: '#0055cc',
        },
      },
      {
        props: { isAllCompleted: true },
        style: {
          backgroundColor: '#1f845a',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1f845a',
            cursor: 'default',
          },
        },
      },
    ],
  });

export const CardTitleChecklistDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 6px 0 4px;
  background: rgba(9, 30, 66, 0.13);
`;

export const CardTitleChecklistAccordion = styled(Accordion.Root)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CardTitleChecklistAccordionItem = styled(Accordion.Item)`
  width: 100%;
`;

export const CardTitleChecklistAccordionHeader = styled(Accordion.Header)`
  margin: 0;
`;

export const CardTitleChecklistAccordionChevron = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: #44546f;
  transition: transform 150ms ease;
`;

export const CardTitleChecklistAccordionTrigger = styled(Accordion.Trigger)`
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
`;

export const CardTitleChecklistAccordionTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;

export const CardTitleChecklistAccordionCount = styled.span`
  flex-shrink: 0;
  color: #44546f;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.07rem;
`;

export const CardTitleChecklistAccordionContent = styled(Accordion.Content)`
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

export const CardTitleChecklistItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px 0 4px 18px;
`;

export const CardTitleChecklistItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 2px 0;
  font-size: 14px;
  line-height: 20px;
  color: #172b4d;
`;

export const CardTitleChecklistCheckbox = styled(Checkbox.Root)({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  marginTop: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '2px',
  border: '1px solid rgba(9, 30, 66, 0.5)',
  backgroundColor: '#fff',
  cursor: 'pointer',

  variants: [
    {
      props: { checked: true },
      style: {
        backgroundColor: checklistProgressBlue,
        borderColor: checklistProgressBlue,
        color: '#fff',
      },
    },
  ],
});

export const CardTitleChecklistCheckboxIndicator = styled(Checkbox.Indicator)`
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardTitleChecklistItemLabel = styled.span`
  min-width: 0;
  word-break: break-word;
  text-align: left;
`;
