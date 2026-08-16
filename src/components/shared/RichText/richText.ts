import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

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

type SerializedRichText = {
  root: SerializedRichTextNode;
};

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
