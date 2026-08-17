import type { HeadingTagType } from '@lexical/rich-text';
import type { ElementFormatType } from 'lexical';
import type { IconType } from 'react-icons';
import type { HEADING_TAGS } from './RichText.constants';

/**
 * Rich text fields (`card.cardDescription`, comment `activity.content`) hold a
 * serialized Lexical editor state. Values written before the rich text editor
 * are still plain text, so every read of those columns goes through here: JSON
 * parses to a node tree, anything else is treated as plain text.
 */
export type SerializedRichTextNode = {
  type?: string;
  children?: SerializedRichTextNode[];
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: string;
};

export type SerializedRichText = {
  root: SerializedRichTextNode;
};

export type BlockType =
  | 'paragraph'
  | 'quote'
  | 'bullet'
  | 'number'
  | HeadingTagType;

type TextFormat = 'bold' | 'italic' | 'underline';

export type BlockTypeOption = {
  value: BlockType;
  label: string;
};

export type TextFormatButton = {
  format: TextFormat;
  label: string;
  Icon: IconType;
};

export type AlignmentButton = {
  alignment: ElementFormatType;
  label: string;
  Icon: IconType;
};

/**
 * Saved rich text renders as plain React rather than through a read-only
 * Lexical instance: the card modal is server rendered, and stored state is user
 * input that never reaches `innerHTML` this way.
 */
export type RichTextContentProps = {
  value: string;
};

export type HeadingTag = (typeof HEADING_TAGS)[number];
