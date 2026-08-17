import {
  $applyNodeReplacement,
  $getDocument,
  DecoratorNode,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type LexicalUpdateJSON,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical';
import type { ReactNode } from 'react';
import { RICH_TEXT_CLASS } from '~/components/shared/RichText/RichText.constants';
import { toSafeUrl } from '~/components/shared/RichText/RichText.utils';

export type SerializedImageNode = Spread<
  { src: string; altText: string },
  SerializedLexicalNode
>;

/**
 * Lexical ships no image node, so `![alt](src)` needs one of its own. It is a
 * decorator rather than an element node: the image has no editable children,
 * and staying inline keeps it valid inside the paragraph the shortcut was
 * typed in.
 */
export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string;
  __altText: string;

  $config() {
    return this.config('image', {
      importDOM: {
        img: () => ({ conversion: $convertImageElement, priority: 0 }),
      },
    });
  }

  constructor(src = '', altText = '', key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  afterCloneFrom(prevNode: this) {
    super.afterCloneFrom(prevNode);
    this.__src = prevNode.__src;
    this.__altText = prevNode.__altText;
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    const self = super.updateFromJSON(serializedNode).getWritable();

    self.__src = serializedNode.src;
    self.__altText = serializedNode.altText;

    return self;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement('img');

    element.setAttribute('src', toSafeUrl(this.__src));
    element.setAttribute('alt', this.__altText);

    return { element };
  }

  createDOM(config: EditorConfig) {
    const element = $getDocument().createElement('span');
    const className = config.theme.image;

    if (typeof className === 'string') {
      element.className = className;
    }

    return element;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  /**
   * An image is the only content a description may hold, so it has to read as
   * non-empty text or the editor would treat that document as blank.
   */
  getTextContent() {
    return `![${this.__altText}](${this.__src})`;
  }

  decorate() {
    return (
      <img
        className={RICH_TEXT_CLASS.image}
        src={toSafeUrl(this.__src)}
        alt={this.__altText}
      />
    );
  }
}

function $convertImageElement(element: HTMLElement): DOMConversionOutput {
  return {
    node: $createImageNode(
      element.getAttribute('src') ?? '',
      element.getAttribute('alt') ?? '',
    ),
  };
}

export function $createImageNode(src: string, altText: string) {
  return $applyNodeReplacement(new ImageNode(src, altText));
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
