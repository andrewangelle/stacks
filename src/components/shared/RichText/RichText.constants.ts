import type { ElementFormatType } from 'lexical';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline,
} from 'react-icons/fa';
import type {
  AlignmentButton,
  BlockType,
  BlockTypeOption,
  MarkdownShortcut,
  TextFormatButton,
} from '~/components/shared/RichText/RichText.types';

export const BLOCK_TYPE_OPTIONS: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Normal' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'bullet', label: 'Bulleted list' },
  { value: 'number', label: 'Numbered list' },
  { value: 'quote', label: 'Quote' },
];

export const TEXT_FORMAT_BUTTONS: TextFormatButton[] = [
  { format: 'bold', label: 'Bold', Icon: FaBold },
  { format: 'italic', label: 'Italic', Icon: FaItalic },
  { format: 'underline', label: 'Underline', Icon: FaUnderline },
];

export const ALIGNMENT_BUTTONS: AlignmentButton[] = [
  { alignment: 'left', label: 'Align left', Icon: FaAlignLeft },
  { alignment: 'center', label: 'Align center', Icon: FaAlignCenter },
  { alignment: 'right', label: 'Align right', Icon: FaAlignRight },
  { alignment: 'justify', label: 'Justify', Icon: FaAlignJustify },
];

export const initialToolbarState = {
  blockType: 'paragraph' as BlockType,
  alignment: '' as ElementFormatType,
  formats: { bold: false, italic: false, underline: false },
  canUndo: false,
  canRedo: false,
};

/** Lexical serializes text formatting as a bitmask on each text node. */
export const TEXT_FORMAT = {
  bold: 1,
  italic: 2,
  strikethrough: 4,
  underline: 8,
  code: 16,
} as const;

export const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export const BLOCK_ALIGNMENTS = ['left', 'center', 'right', 'justify'] as const;

/**
 * Formats Lexical does not give an element of its own arrive as theme classes
 * instead, and `richTextStyles` paints them for both the editor and the saved
 * value. `RichTextContent` re-renders saved state as plain React, so it hands
 * out the same class names rather than a second set of rules.
 */
export const RICH_TEXT_CLASS = {
  underline: 'rich-text-underline',
  strikethrough: 'rich-text-strikethrough',
  underlineStrikethrough: 'rich-text-underline-strikethrough',
  inlineCode: 'rich-text-inline-code',
  code: 'rich-text-code',
  link: 'rich-text-link',
  image: 'rich-text-image',
  horizontalRule: 'rich-text-hr',
  nestedListItem: 'rich-text-nested-listitem',
} as const;

export const richTextTheme = {
  text: {
    underline: RICH_TEXT_CLASS.underline,
    strikethrough: RICH_TEXT_CLASS.strikethrough,
    underlineStrikethrough: RICH_TEXT_CLASS.underlineStrikethrough,
    code: RICH_TEXT_CLASS.inlineCode,
  },
  code: RICH_TEXT_CLASS.code,
  link: RICH_TEXT_CLASS.link,
  image: RICH_TEXT_CLASS.image,
  hr: RICH_TEXT_CLASS.horizontalRule,
  list: {
    nested: {
      listitem: RICH_TEXT_CLASS.nestedListItem,
    },
  },
};

/**
 * The help dialog's cheat sheet. `keys` are typed one after another, so a
 * trailing `Space` entry is the keystroke that commits a block-level shortcut.
 */
export const MARKDOWN_SHORTCUTS: MarkdownShortcut[] = [
  { label: 'Bold', keys: ['**Bold**'] },
  { label: 'Italic', keys: ['*Italic*'] },
  { label: 'Strikethrough', keys: ['~~Strikethrough~~'] },
  { label: 'Heading 1', keys: ['#', 'Space'] },
  { label: 'Heading 2', keys: ['##', 'Space'] },
  { label: 'Heading 3', keys: ['###', 'Space'] },
  { label: 'Heading 4', keys: ['####', 'Space'] },
  { label: 'Heading 5', keys: ['#####', 'Space'] },
  { label: 'Heading 6', keys: ['######', 'Space'] },
  { label: 'Numbered list', keys: ['1.', 'Space'] },
  { label: 'Bullet list', keys: ['*', 'Space'] },
  { label: 'Quote', keys: ['>', 'Space'] },
  { label: 'Code snippet', keys: ['```', 'Space'] },
  { label: 'Divider', keys: ['---', 'Space'] },
  { label: 'Link', keys: ['[Link](http://a.com)'] },
  { label: 'Code', keys: ['`Code`'] },
  { label: 'Image', keys: ['![Alt text](http://www.image.com)'] },
];
