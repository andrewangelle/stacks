import { Collapsible, Popover, Progress } from 'radix-ui';
import { type DataAttributes, keyframes, styled } from 'styled-components';
import { fontFamily } from '~/components/Boards/Boards.styled';
import {
  CardModalActionButton,
  type CardModalSectionExpandedProps,
  CardModalTitle,
  cardModalContentIndent,
  cardModalSectionIconStyles,
  cardModalSectionToggleStyles,
  EditCardTitleForm,
  EditCardTitleInput,
} from '~/components/Cards/Card.styled';
import { animationStyles } from '~/styles/animations';
import {
  Button,
  secondaryButtonColor,
  secondaryButtonStyles,
} from '~/styles/Page.styled';
import { focusRingBlue } from '~/styles/tokens';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const ChecklistsContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistsContainer',
})`
  margin: 30px 12px 0px;
`;

export const ChecklistContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistContainer',
})`
  margin: 30px 0px;
`;

export const ChecklistToggleButton = styled(
  Collapsible.Trigger,
).attrs<DataAttributes>({
  'data-testid': 'ChecklistToggleButton',
})<CardModalSectionExpandedProps>`
  ${cardModalSectionToggleStyles}
`;

export const ChecklistCheckIcon = styled.span.attrs<DataAttributes>({
  'data-testid': 'ChecklistCheckIcon',
  'data-section-icon': 'resting',
})`
  ${cardModalSectionIconStyles}
`;

export const ChecklistCaretIcon = styled.span.attrs<DataAttributes>({
  'data-testid': 'ChecklistCaretIcon',
  'data-section-icon': 'caret',
})`
  ${cardModalSectionIconStyles}
`;

const checklistSlideDownFrames = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
  }
`;

const checklistSlideUpFrames = keyframes`
  from {
    height: var(--radix-collapsible-content-height);
  }
  to {
    height: 0;
  }
`;

/**
 * Radix measures the closed height into `--radix-collapsible-content-height`
 * and keeps the subtree mounted for the duration of the exit animation, so the
 * slide only needs keyframes; nothing here may set a height of its own.
 */
export const ChecklistCollapsibleContent = styled(
  Collapsible.Content,
).attrs<DataAttributes>({
  'data-testid': 'ChecklistCollapsibleContent',
})`
  overflow: hidden;

  &[data-state='open'] {
    animation: ${checklistSlideDownFrames} 150ms ease-out;
  }

  &[data-state='closed'] {
    animation: ${checklistSlideUpFrames} 150ms ease-out;
  }
`;

export const ChecklistHeaderLeading = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistHeaderLeading',
})`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1 1 auto;
`;

export const ChecklistPopoverContent = styled(
  Popover.Content,
).attrs<DataAttributes>({
  'data-testid': 'ChecklistPopoverContent',
})` 
  width: 304px;
  border-radius: 8px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1;
  box-shadow: 0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F;
`;

export const ChecklistItemOptionsContent = styled(ChecklistPopoverContent)` 
  height: 130px;
  padding: 10px;
`;
export const ChecklistPopoverHeader = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistPopoverHeader',
})`
  font-weight: 600;
  display: flex;
  justify-content: center;
  color: rgba(9, 30, 66, .75);
  padding: 10px;
`;

export const CreateChecklistTitle = styled.div.attrs<DataAttributes>({
  'data-testid': 'CreateChecklistTitle',
})` 
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 700;
  color: rgba(9, 30, 66, .75);
  padding: 10px;
`;

export const CreateChecklistInput = styled.input.attrs<DataAttributes>({
  'data-testid': 'CreateChecklistInput',
})` 
  padding: 8px 12px;
  border: none;
  box-shadow: inset 0 0 0 2px #dfe1e6;
  background-color: #fafbfc;
  margin: 8px;
  width: initial;
`;

export const CreateChecklistAddButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'CreateChecklistAddButton',
})` 
  padding: 10px 20px;
  align-self: flex-start;
  margin: 8px;
`;

export const DeleteChecklistButton = styled(
  CardModalActionButton,
).attrs<DataAttributes>({
  'data-testid': 'DeleteChecklistButton',
})`
  && {
    font-size: 14px;
  }
`;

/**
 * Collapsed hides the actions in place rather than dropping them, so the header
 * keeps the exact box — and the title the exact baseline — either way.
 */
export const ChecklistHeaderActions = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistHeaderActions',
})<CardModalSectionExpandedProps>`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  visibility: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};
`;

export const ToggleCheckedItemsButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'ToggleCheckedItemsButton',
})`
  ${secondaryButtonStyles}
  color: rgba(9, 30, 66, 0.725);
  border: 1px solid rgba(9, 30, 66, 0.2);
  padding: 8px 10px;
  margin: 0;
  font-size: 14px;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    color: ${secondaryButtonColor};
  }
`;

export const AllItemsCompleteMessage = styled.p.attrs<DataAttributes>({
  'data-testid': 'AllItemsCompleteMessage',
})`
  color: #5e6c84;
  font-size: 14px;
  margin: 8px 0 8px ${cardModalContentIndent};
`;

export const ChecklistHeader = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistHeader',
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const ChecklistProgressIndicator = styled(
  Progress.Indicator,
).attrs<DataAttributes>({
  'data-testid': 'ChecklistProgressIndicator',
})` 
  height: 100%;
  transition: width 660ms cubic-bezier(0.65, 0, 0.35, 1);
`;

export const ChecklistProgressRoot = styled(
  Progress.Root,
).attrs<DataAttributes>({
  'data-testid': 'ChecklistProgressRoot',
})` 
  position: relative;
  overflow: hidden;
  background: #091e4214;
  border-radius: 99999px;
  height: 8px;
  width: 100%;
  margin: 15px 0;
`;

export const ChecklistProgressRow = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistProgressRow',
})`
  display: grid;
  grid-template-columns: ${checklistRowColumns};
  align-items: flex-start;
  position: relative;
`;

export const ChecklistProgressPercentage = styled.span.attrs<DataAttributes>({
  'data-testid': 'ChecklistProgressPercentage',
})`
  color: #5e6c84;
  font-size: 11px;
  width: 32px;
  margin-top: 12px;
`;

export const ChecklistTitle = styled(CardModalTitle).attrs<DataAttributes>({
  'data-testid': 'ChecklistTitle',
})`
  font-size: 14px;
  min-width: 0;
  overflow-wrap: anywhere;
`;

/**
 * The heading opens the rename editor, so the control itself is a button rather
 * than a click handler on the `h2` — that is what puts it in the tab order and
 * makes Enter and Space work without hand-rolled key handling. It fills the
 * heading so a click anywhere along the title still lands on it.
 */
export const ChecklistTitleButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'ChecklistTitleButton',
  type: 'button',
})`
  all: unset;
  box-sizing: border-box;
  display: block;
  width: 100%;
  text-align: left;
  overflow-wrap: anywhere;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${focusRingBlue};
    outline-offset: 2px;
    border-radius: 3px;
  }
`;
export const EditChecklistTitleForm = styled(EditCardTitleForm)``;
export const EditChecklistTitleInput = styled(
  EditCardTitleInput,
).attrs<DataAttributes>({
  'data-testid': 'EditCardTitleInput',
})`
  font-size: 14px;
`;

export const ChecklistNameSkeletonContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistNameSkeletonContainer',
})`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ChecklistNameSkeleton = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistNameSkeleton',
})`
  background: rgba(9, 30, 66, 0.25);
  cursor: default;
  pointer-events: none;
  min-height: 16px;
  width: 75px;
  height: 24px;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;
  ${animationStyles.pulse}
`;

export const DeleteChecklistSkeleton = styled.div.attrs<DataAttributes>({
  'data-testid': 'DeleteChecklistSkeleton',
})`
  background: rgba(9, 30, 66, 0.25);
  cursor: default;
  pointer-events: none;
  min-height: 16px;
  width: 60px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;
  ${animationStyles.pulse}
`;

export const ChecklistProgressSkeleton = styled.div.attrs<DataAttributes>({
  'data-testid': 'ChecklistProgressSkeleton',
})`
  background: rgba(9, 30, 66, 0.25);
  cursor: default;
  pointer-events: none;
  min-height: 16px;
  width: 100%;
  height: 8px;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;
  margin: 12px 0;
  ${animationStyles.pulse}
`;
