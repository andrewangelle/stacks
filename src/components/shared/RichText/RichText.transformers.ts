import { CodeNode } from '@lexical/code-core';
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '@lexical/extension';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CODE,
  type ElementTransformer,
  HEADING,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  type TextMatchTransformer,
  UNORDERED_LIST,
} from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from '~/components/shared/RichText/RichTextImageNode';

/**
 * Lexical has no divider transformer of its own. Typing the rule as the last
 * block has to leave its paragraph behind, or the caret has nowhere to land.
 */
const HORIZONTAL_RULE: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node) => ($isHorizontalRuleNode(node) ? '---' : null),
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode, _children, _match, isImport) => {
    const divider = $createHorizontalRuleNode();

    if (isImport || parentNode.getNextSibling() !== null) {
      parentNode.replace(divider);
    } else {
      parentNode.insertBefore(divider);
    }

    divider.selectNext();
  },
  triggerOnEnter: true,
  type: 'element',
};

const IMAGE: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) =>
    $isImageNode(node) ? `![${node.getAltText()}](${node.getSrc()})` : null,
  importRegExp: /!\[([^[]*)\]\(([^()\s]+)\)/,
  regExp: /!\[([^[]*)\]\(([^()\s]+)\)$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;

    textNode.replace($createImageNode(src, altText));
  },
  trigger: ')',
  type: 'text-match',
};

export const richTextNodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  LinkNode,
  HorizontalRuleNode,
  ImageNode,
];

/**
 * Order is load bearing for the transformers that share a trigger character:
 * `IMAGE` has to be tried before `LINK`, whose regexp also matches the
 * `[alt](src)` tail of an image, and `INLINE_CODE` before the other text
 * formats so a code span swallows the markers inside it.
 */
export const richTextTransformers = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  HORIZONTAL_RULE,
  CODE,
  INLINE_CODE,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  IMAGE,
  LINK,
];
