import { $isListNode } from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from '@lexical/rich-text';
import { $dfs } from '@lexical/utils';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isDecoratorNode,
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

  return !hasContent(parsed.root);
}

/** A divider or an image carries no text but is still worth saving. */
const CONTENT_NODE_TYPES = new Set(['image', 'horizontalrule']);

function hasContent(node: SerializedRichTextNode): boolean {
  if (typeof node.text === 'string' && node.text.trim() !== '') {
    return true;
  }

  if (node.type !== undefined && CONTENT_NODE_TYPES.has(node.type)) {
    return true;
  }

  return (node.children ?? []).some(hasContent);
}

/** The editor-side counterpart of `isEmptyRichText`, read inside an update. */
export function $isBlankDocument() {
  const root = $getRoot();

  if (root.getTextContent().trim() !== '') {
    return false;
  }

  return !$dfs(root).some(({ node }) => $isDecoratorNode(node));
}

const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * A saved document is user input that `RichTextContent` renders straight into
 * `href` and `src`, so every URL read back out of it clears a scheme
 * allowlist first. Anything that fails to parse — a relative path included —
 * is treated as unverifiable and blanked rather than trusted.
 */
export function toSafeUrl(url: string | undefined) {
  if (!url) {
    return 'about:blank';
  }

  try {
    return SAFE_URL_PROTOCOLS.has(new URL(url).protocol) ? url : 'about:blank';
  } catch {
    return 'about:blank';
  }
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
