import { css, type DataAttributes, styled } from 'styled-components';
import { blue, focusRingBlue, fontFamily } from '~/styles/tokens';

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

export const RichTextSurface = styled.div`
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
export const RichTextToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const RichTextToolbarDivider = styled.span`
  width: 1px;
  align-self: stretch;
  margin: 2px 6px;
  background: rgba(9, 30, 66, 0.15);
`;

export const RichTextToolbarButton = styled.button<{ $active?: boolean }>`
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

export const RichTextBlockSelect = styled.select`
  max-width: 100%;
  height: 28px;
  padding: 0 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-family: ${fontFamily};
  font-size: 14px;
  color: rgba(9, 30, 66, 0.9);
  cursor: pointer;

  &:hover {
    background: rgba(9, 30, 66, 0.08);
  }
`;

export const RichTextBody = styled.div<{ $minHeight: string }>`
  ${richTextStyles}
  position: relative;

  [contenteditable] {
    min-height: ${({ $minHeight }) => $minHeight};
    padding: 12px;
    outline: none;
    overflow-wrap: anywhere;
  }
`;

export const RichTextPlaceholder = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  color: rgba(9, 30, 66, 0.5);
  pointer-events: none;
  user-select: none;
`;
