import { ListItemNode, ListNode } from '@lexical/list';
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  ORDERED_LIST,
  QUOTE,
  UNORDERED_LIST,
} from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
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
} as const;

export const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export const BLOCK_ALIGNMENTS = ['left', 'center', 'right', 'justify'] as const;

export const richTextNodes = [HeadingNode, QuoteNode, ListNode, ListItemNode];

export const richTextTransformers = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
];

/**
 * Lexical tags bold and italic with elements of their own but leaves the
 * remaining text formats to theme classes, which `richTextStyles` paints for
 * both the editor and the saved value.
 */
export const richTextTheme = {
  text: {
    underline: 'rich-text-underline',
    strikethrough: 'rich-text-strikethrough',
    underlineStrikethrough: 'rich-text-underline-strikethrough',
  },
  list: {
    nested: {
      listitem: 'rich-text-nested-listitem',
    },
  },
};
