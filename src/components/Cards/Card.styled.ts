import { styled } from '@pigment-css/react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { Button } from '~/styles/Page.styled';
import { checklistProgressBlue, focusRingBlue } from '~/styles/tokens';

const cardModalBreakpoint = '@media (max-width: 850px)';

/** Section icon width (description list icon, checklist icon, etc.). */
export const cardModalSectionIconSize = '24px';

/** Left edge of description body, checklist labels, inputs, and action rows (icon + 16px gap). */
export const cardModalContentIndent = '40px';

export const CardModalRoot = styled(Dialog.Root)``;
export const CardModalPortal = styled(Dialog.Portal)``;
export const CardModalOverlay = styled(Dialog.Overlay)` 
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 2;
`;

export const CardModalBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 8px minmax(200px, 280px);
  grid-template-rows: minmax(0, 1fr);
  gap: 0;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;

  ${cardModalBreakpoint} {
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const CardActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 12px 0px 44px;
`;

export const CardModalActionButton = styled.div`
  font-family: ${fontFamily};
  background: #091e420a;
  border-radius: 5px;
  padding: 12px;
  display: flex;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(0,0,0, 0.1);
  }
`;

export const CardModalSiderButtonText = styled.span` 
  font-family: ${fontFamily};
  font-size: 12px;
`;

export const CreateChecklistPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
`;

export const DeleteCardPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
`;

export const ResizeableCardColumnHandle = styled.div`
  height: 100%;
  cursor: ew-resize;
  touch-action: none;
  position: relative;
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 100%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.2);
  }

  &:hover::after {
    background: ${focusRingBlue}; 
    width: 4px;
  }

  ${cardModalBreakpoint} {
    display: none;
  }
`;

export const CardMainColumn = styled.div`
  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  ${cardModalBreakpoint} {
    padding-right: 0;
    flex-shrink: 0;
    min-height: unset;
    overflow: visible;
  }
`;

export const CardActivityColumn = styled.div`
  min-width: 0;
  min-height: 0;
  padding: 12px;
  background: #ebecf0;
  overflow-y: auto;

  ${cardModalBreakpoint} {
    background: white;
    flex-shrink: 0;
    min-height: unset;
    overflow: visible;
  }
`;

export const CardModalContent = styled(Dialog.Content)`
  position: relative;
  font-family: ${fontFamily};
  display: flex;
  flex-direction: column;
  max-width: 88vw;
  height: 95vh;
  width: 100%;
  margin: 0 30px;
  overflow: hidden;
  background: white;
  border-radius: 5px;

  ${cardModalBreakpoint} {
    min-width: unset;
    max-width: calc(100% - 30px);
    height: auto;
    max-height: 99vh;
  }
`;

export const CardModalTrigger = styled(Dialog.Trigger)` 
  border: none;
  padding: 0px;
  cursor: pointer;
  width: 100%;
`;

export const CardModalCloseContainer = styled.div` 
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0, 0.2);
  `;

export const CardModalClose = styled(Dialog.Close)` 
  border: none;
  right: 0;
  padding: 8px;

  cursor: pointer;
  background: white;
  margin: 4px 12px 4px 4px;

  &:hover {
    background: rgba(0,0,0, 0.1);
    border-radius: 5px;
  }
`;

export const CardModalTitleContainer = styled.div`
  display: flex;
  margin: 12px 12px 0px;
`;

export const CardModalTitle = styled(Dialog.Title)` 
  margin: 0 16px;
  font-size: 18px;
`;

export const CardModalListName = styled.div` 
  font-size: 14px;
  margin: 4px 12px 12px 20px;
 `;

export const DescriptionContainer = styled.div`
  margin: 30px 12px 0px;
`;

export const DescriptionPlaceholder = styled.div` 
  background: rgba(0,0,0, 0.03);
  height: 30px;
  margin-left: ${cardModalContentIndent};
  font-size: 14px;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: rgba(0,0,0, 0.1);
  }
`;

export const DescriptionInput = styled.textarea` 
  height: 60px;
  width: 80%;
  margin-left: ${cardModalContentIndent};
  font-size: 14px;
  padding: 15px;
  border-radius: 5px;
  border: none;
  font-family: ${fontFamily};
`;

export const SaveDescriptionButton = styled(Button)` 
  padding: 8px 10px;
  margin: 0 10px 0 ${cardModalContentIndent};
`;

export const CloseDescriptionButton = styled(Button)`
  padding: 8px 10px;
  margin: 0;
  border: none;
  color: black;
`;

export const CardDescriptionText = styled.div` 
  font-family: ${fontFamily};
  margin-left: ${cardModalContentIndent};
  font-size: 14px;
  margin-top: 15px;
`;

export const EditDescriptionButton = styled(Button)` 
  border: none;
  padding: 8px 10px;
  color: black;
  margin: -4px 0px 0px 0px;
`;

export const EditCardTitleForm = styled.form`
  position: relative;
  top: -1px;
  left: -2px;
`;

export const EditCardTitleInput = styled.input` 
  border: none;
  margin: 0 16px;
  font-size: 18px;
  font-weight: 700;
  font-family: ${fontFamily};
`;

export const DragCardShadow = styled.div<{ height?: number; width?: number }>({
  height: ({ height }) => `${height ?? 0}px`,
  width: ({ width }) => `${width ?? 0}px`,
  background: 'rgba(0,0,0,0.1)',
  margin: '4px auto',
  borderRadius: '5px',
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
    marginTop: '2px',
    padding: '2px 6px',
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
`;
