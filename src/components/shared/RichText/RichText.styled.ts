import { Select } from 'radix-ui';
import { css, type DataAttributes, styled } from 'styled-components';
import { blue, focusRingBlue, fontFamily } from '~/styles/tokens';

type ActiveProps = { $active?: boolean };
type MinHeightProps = { $minHeight: string };

/**
 * Rich text is authored in Lexical and read back through `RichTextContent`, so
 * the editor surface and the saved value share one set of typography rules.
 * Lexical tags bold and italic with elements of their own; the remaining
 * formats arrive as the theme classes below.
 */
export const richTextStyles = css`
  font-family: ${fontFamily};
  font-size: 14px;
  line-height: 1.5;
  color: rgba(9, 30, 66, 0.9);

  p,
  ul,
  ol,
  blockquote,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 8px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.3;
  }

  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 17px;
  }

  h3,
  h4,
  h5,
  h6 {
    font-size: 15px;
  }

  ul,
  ol {
    padding-left: 24px;
  }

  li {
    margin: 2px 0;
  }

  blockquote {
    padding-left: 12px;
    border-left: 3px solid rgba(9, 30, 66, 0.2);
    color: rgba(9, 30, 66, 0.65);
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  u,
  .rich-text-underline {
    text-decoration: underline;
  }

  s,
  .rich-text-strikethrough {
    text-decoration: line-through;
  }

  .rich-text-underline-strikethrough {
    text-decoration: underline line-through;
  }

  .rich-text-nested-listitem {
    list-style-type: none;
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const RichTextSurface = styled.div.attrs<DataAttributes>({
  'data-testid': 'RichTextSurface',
})`
  box-sizing: border-box;
  width: 100%;
  border: 1px solid rgba(9, 30, 66, 0.2);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;

  &:focus-within {
    border-color: ${focusRingBlue};
  }
`;

export const RichTextToolbarRow = styled.div.attrs<DataAttributes>({
  'data-testid': 'RichTextToolbar',
})`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(9, 30, 66, 0.12);
  background: rgb(250, 251, 252);
`;

/** Keeps a set of related controls on one line when the toolbar wraps. */
export const RichTextToolbarGroup = styled.div.attrs<DataAttributes>({
  'data-testid': 'RichTextToolbarGroup',
})`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const RichTextToolbarDivider = styled.span.attrs<DataAttributes>({
  'data-testid': 'RichTextToolbarDivider',
})`
  width: 1px;
  align-self: stretch;
  margin: 2px 6px;
  background: rgba(9, 30, 66, 0.15);
`;

export const RichTextToolbarButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'RichTextToolbarButton',
})<ActiveProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#E9F2FF' : 'transparent')};
  color: ${({ $active }) => ($active ? blue : 'rgba(9, 30, 66, 0.7)')};

  &:hover:not(:disabled) {
    background: ${({ $active }) =>
      $active ? '#E9F2FF' : 'rgba(9, 30, 66, 0.08)'};
  }

  &:disabled {
    color: rgba(9, 30, 66, 0.25);
    cursor: not-allowed;
  }
`;

/**
 * A `Tt` glyph rather than the selected label, so the control keeps a toolbar
 * button's footprint. The menu it opens follows the move card menu's selects.
 */
export const RichTextBlockSelectTrigger = styled(
  Select.Trigger,
).attrs<DataAttributes>({
  'data-testid': 'RichTextBlockSelect',
})`
  display: flex;
  align-items: center;
  gap: 2px;
  box-sizing: border-box;
  height: 28px;
  padding: 0 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-family: ${fontFamily};
  font-size: 17px;
  color: rgba(9, 30, 66, 0.7);
  cursor: pointer;
  outline: none;

  &:hover {
    background: rgba(9, 30, 66, 0.08);
  }

  &:focus-visible {
    outline: 2px solid ${focusRingBlue};
    outline-offset: -2px;
  }

  &[data-state='open'] {
    background: #e9f2ff;
    color: ${blue};
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }

  &[data-state='open'] svg {
    transform: rotate(180deg);
  }
`;

/** Names the trigger for assistive tech without showing the label. */
export const RichTextBlockSelectValue = styled.span.attrs<DataAttributes>({
  'data-testid': 'RichTextBlockSelectValue',
})`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const RichTextBlockSelectContent = styled(
  Select.Content,
).attrs<DataAttributes>({
  'data-testid': 'RichTextBlockSelectMenu',
})`
  box-sizing: border-box;
  min-width: 200px;
  max-height: var(--radix-select-content-available-height);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 8px 12px #1e1f2126, 0px 0px 1px #1e1f214f;
  overflow: hidden;
  z-index: 1001;
`;

export const RichTextBlockSelectViewport = styled(
  Select.Viewport,
).attrs<DataAttributes>({
  'data-testid': 'RichTextBlockSelectViewport',
})`
  padding: 4px 0;
`;

/**
 * Each row previews the block it inserts, so the sizes here track the heading
 * and list rules in `richTextStyles`.
 */
export const RichTextBlockSelectItem = styled(
  Select.Item,
).attrs<DataAttributes>({
  'data-testid': 'RichTextBlockSelectItem',
})`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 14px;
  font-family: ${fontFamily};
  font-size: 14px;
  line-height: 1.3;
  color: rgba(9, 30, 66, 0.9);
  cursor: pointer;
  outline: none;
  user-select: none;

  &[data-block-type='h1'] {
    font-size: 20px;
    font-weight: 700;
  }

  &[data-block-type='h2'] {
    font-size: 17px;
    font-weight: 700;
  }

  &[data-block-type='h3'] {
    font-size: 15px;
    font-weight: 700;
  }

  &[data-block-type='bullet']::before {
    content: '•';
    margin-right: 8px;
  }

  &[data-block-type='number']::before {
    content: '1.';
    margin-right: 8px;
  }

  &[data-block-type='quote'] {
    color: rgba(9, 30, 66, 0.65);
    box-shadow: inset 3px 0 0 rgba(9, 30, 66, 0.2);
  }

  &[data-highlighted] {
    background: rgb(244, 245, 247);
  }

  &[data-state='checked'],
  &[data-state='checked'][data-highlighted] {
    background: #e9f2ff;
    color: ${blue};
    box-shadow: inset 3px 0 0 ${blue};
  }
`;

export const RichTextBody = styled.div.attrs<DataAttributes>({
  'data-testid': 'RichTextBody',
})<MinHeightProps>`
  ${richTextStyles}
  position: relative;

  [contenteditable] {
    min-height: ${({ $minHeight }) => $minHeight};
    padding: 12px;
    outline: none;
    overflow-wrap: anywhere;
  }
`;

export const RichTextPlaceholder = styled.div.attrs<DataAttributes>({
  'data-testid': 'RichTextPlaceholder',
})`
  position: absolute;
  top: 12px;
  left: 12px;
  color: rgba(9, 30, 66, 0.5);
  pointer-events: none;
  user-select: none;
`;
