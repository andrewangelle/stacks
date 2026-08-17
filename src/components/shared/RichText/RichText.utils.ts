import { $isListNode } from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from '@lexical/rich-text';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  type LexicalNode,
} from 'lexical';
import type { MouseEvent } from 'react';
import { BLOCK_TYPE_OPTIONS } from '~/components/shared/RichText/RichText.constants';
import type {
  BlockType,
  SerializedRichText,
  SerializedRichTextNode,
} from '~/components/shared/RichText/RichText.types';

export function parseRichText(value: string): SerializedRichText | null {
  if (!value.startsWith('{')) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as SerializedRichText;

    return parsed?.root?.type === 'root' ? parsed : null;
  } catch {
    return null;
  }
}

export function isEmptyRichText(value: string) {
  const parsed = parseRichText(value);

  if (!parsed) {
    return value.trim() === '';
  }

  return !hasText(parsed.root);
}

function hasText(node: SerializedRichTextNode): boolean {
  if (typeof node.text === 'string' && node.text.trim() !== '') {
    return true;
  }

  return (node.children ?? []).some(hasText);
}

export function toInitialEditorState(value: string) {
  if (parseRichText(value)) {
    return value;
  }

  return () => {
    const root = $getRoot();

    for (const line of value.split('\n')) {
      const paragraph = $createParagraphNode();

      if (line !== '') {
        paragraph.append($createTextNode(line));
      }

      root.append(paragraph);
    }
  };
}

export function toBlockType(element: LexicalNode): BlockType {
  if ($isListNode(element)) {
    return element.getListType() === 'number' ? 'number' : 'bullet';
  }

  if ($isQuoteNode(element)) {
    return 'quote';
  }

  if ($isHeadingNode(element)) {
    const tag = element.getTag();

    return BLOCK_TYPE_OPTIONS.some((option) => option.value === tag)
      ? tag
      : 'paragraph';
  }

  return 'paragraph';
}

export function createBlockNode(
  blockType: Exclude<BlockType, 'bullet' | 'number'>,
) {
  if (blockType === 'quote') {
    return $createQuoteNode();
  }

  if (blockType === 'paragraph') {
    return $createParagraphNode();
  }

  return $createHeadingNode(blockType);
}

/** Toolbar clicks must not pull focus, or the selection they act on is gone. */
export function keepSelection(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}
