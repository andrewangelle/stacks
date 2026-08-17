import { type DataAttributes, styled } from 'styled-components';
import { fontFamily } from '~/components/Boards/Boards.styled';
import {
  type CardModalSectionExpandedProps,
  CardModalTitle,
  cardModalContentIndent,
  cardModalSectionIconStyles,
  cardModalSectionToggleStyles,
} from '~/components/Cards/Card.styled';
import { richTextStyles } from '~/components/shared/RichText/RichText.styled';
import {
  Button,
  secondaryButtonColor,
  secondaryButtonStyles,
} from '~/styles/Page.styled';

export const CardDescriptionContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionContainer',
})`
  margin: 30px 12px 0px;
`;

export const CardDescriptionHeadingRow = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionHeadingRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

type ExpandedProps = CardModalSectionExpandedProps;

export const CardDescriptionListIcon = styled.span.attrs<DataAttributes>({
  'data-testid': 'DescriptionListIcon',
  'data-section-icon': 'resting',
})`
  ${cardModalSectionIconStyles}
`;

export const CardDescriptionCaretIcon = styled.span.attrs<DataAttributes>({
  'data-testid': 'DescriptionCaretIcon',
  'data-section-icon': 'caret',
})`
  ${cardModalSectionIconStyles}
`;

export const CardDescriptionToggleButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'DescriptionToggleButton',
  type: 'button',
})<ExpandedProps>`
  ${cardModalSectionToggleStyles}
`;

export const CardDescriptionTitle = styled(
  CardModalTitle,
).attrs<DataAttributes>({
  'data-testid': 'DescriptionTitle',
})`
  font-size: 14px;
`;

export const CardDescriptionPlaceholder = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionPlaceholder',
})` 
  border: 1px solid rgba(0,0,0, 0.5);
  height: 30px;
  margin-left: ${cardModalContentIndent};
  font-size: 14px;
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(0,0,0, 0.5);
  font-weight: 500;

  &:hover {
    background: rgba(0,0,0, 0.1);
  }
`;

/**
 * The collapse slide. The row animates between `0fr` and `1fr` so the body
 * travels to its own height without anyone measuring it, and its contents stay
 * mounted throughout: Lexical seeds itself from `initialValue` once, on mount,
 * so unmounting the editor to collapse would drop the draft in progress.
 */
export const CardDescriptionBody = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionBody',
})<ExpandedProps>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? '1fr' : '0fr')};
  transition: grid-template-rows 150ms ease-out;
`;

/**
 * `visibility` transitions discretely at the far end of its duration, so the
 * body stays painted for the whole slide up and only then drops out of the
 * a11y tree and the tab order.
 */
export const CardDescriptionBodyInner = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionBodyInner',
})<ExpandedProps>`
  min-height: 0;
  overflow: hidden;
  visibility: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};
  transition: visibility 150ms ease-out;
`;

export const CardDescriptionEditorContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionEditorContainer',
})`
  margin: 0 12px 12px ${cardModalContentIndent};
`;

export const SaveDescriptionButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'SaveDescriptionButton',
})` 
  padding: 8px 10px;
  margin: 0 10px 0 ${cardModalContentIndent};
`;

export const CloseDescriptionButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'CloseDescriptionButton',
})`
  ${secondaryButtonStyles}
  padding: 8px 10px;
  margin: 0;
  color: black;
  border: none;

  &:hover:not(:disabled) {
    color: ${secondaryButtonColor};
  }
`;

/**
 * Sits in the heading row's trailing slot, which the edit button vacates for
 * the duration of an edit, so the two never compete for the space.
 */
export const UnsavedChangesBadge = styled.span.attrs<DataAttributes>({
  'data-testid': 'UnsavedChangesBadge',
})`
  flex-shrink: 0;
  padding: 6px 10px;
  border: 1px solid #e2b203;
  border-radius: 4px;
  background: #fff0b3;
  font-size: 14px;
  color: rgba(9, 30, 66, 0.9);
  white-space: nowrap;
`;

export const CardDescriptionText = styled.div.attrs<DataAttributes>({
  'data-testid': 'CardDescriptionText',
})`
  ${richTextStyles}
  margin-left: ${cardModalContentIndent};
  cursor: pointer;
`;

/**
 * Collapsed hides the button in place rather than dropping it, so the heading
 * row keeps the exact box — and the title the exact baseline — either way.
 */
export const EditDescriptionButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'EditDescriptionButton',
})<ExpandedProps>`
  ${secondaryButtonStyles}
  color: rgba(9, 30, 66, 0.725);
  border: 1px solid rgba(9, 30, 66, 0.2);
  padding: 8px 10px;
  margin: 0;
  font-size: 14px;
  flex-shrink: 0;
  visibility: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};

  &:hover:not(:disabled) {
    color: ${secondaryButtonColor};
  }
`;

export const EditCardTitleForm = styled.form`
  position: relative;
  top: -1px;
  left: -2px;
`;

export const EditCardTitleInput = styled.input.attrs<DataAttributes>({
  'data-testid': 'EditCardTitleInput',
})` 
  border: none;
  margin: 0 16px;
  font-size: 28px;
  font-weight: 700;
  font-family: ${fontFamily};
`;
