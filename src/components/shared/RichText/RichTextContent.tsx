import { Fragment, type ReactNode } from 'react';
import {
  BLOCK_ALIGNMENTS,
  HEADING_TAGS,
  TEXT_FORMAT,
} from '~/components/shared/RichText/RichText.constants';
import type {
  HeadingTag,
  RichTextContentProps,
  SerializedRichTextNode,
} from '~/components/shared/RichText/RichText.types';
import { parseRichText } from '~/components/shared/RichText/RichText.utils';

export function RichTextContent({ value }: RichTextContentProps) {
  const parsed = parseRichText(value);

  if (!parsed) {
    return <>{renderPlainText(value)}</>;
  }

  return <>{renderChildren(parsed.root, 'root')}</>;
}

function renderChildren(
  node: SerializedRichTextNode,
  path: string,
): ReactNode[] {
  const children = node.children ?? [];
  const rendered: ReactNode[] = [];

  for (let index = 0; index < children.length; index += 1) {
    rendered.push(renderNode(children[index], `${path}.${index}`));
  }

  return rendered;
}

function renderNode(node: SerializedRichTextNode, key: string): ReactNode {
  if (node.type === 'text') {
    return renderText(node, key);
  }

  if (node.type === 'linebreak') {
    return <br key={key} />;
  }

  const children = renderChildren(node, key);
  const style = toBlockStyle(node);

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} style={style}>
          {children.length > 0 ? children : <br />}
        </p>
      );
    case 'heading': {
      const Heading = toHeadingTag(node.tag);

      return (
        <Heading key={key} style={style}>
          {children}
        </Heading>
      );
    }
    case 'quote':
      return (
        <blockquote key={key} style={style}>
          {children}
        </blockquote>
      );
    case 'list':
      return node.listType === 'number' ? (
        <ol key={key} style={style}>
          {children}
        </ol>
      ) : (
        <ul key={key} style={style}>
          {children}
        </ul>
      );
    case 'listitem':
      return (
        <li key={key} style={style}>
          {children}
        </li>
      );
    default:
      return <Fragment key={key}>{children}</Fragment>;
  }
}

function renderText(node: SerializedRichTextNode, key: string): ReactNode {
  const format = typeof node.format === 'number' ? node.format : 0;
  let content: ReactNode = node.text ?? '';

  if ((format & TEXT_FORMAT.bold) !== 0) {
    content = <strong>{content}</strong>;
  }

  if ((format & TEXT_FORMAT.italic) !== 0) {
    content = <em>{content}</em>;
  }

  if ((format & TEXT_FORMAT.underline) !== 0) {
    content = <u>{content}</u>;
  }

  if ((format & TEXT_FORMAT.strikethrough) !== 0) {
    content = <s>{content}</s>;
  }

  return <Fragment key={key}>{content}</Fragment>;
}

function renderPlainText(value: string): ReactNode[] {
  const lines = value.split('\n');
  const rendered: ReactNode[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    rendered.push(<p key={`line.${index}`}>{lines[index] || <br />}</p>);
  }

  return rendered;
}

function toHeadingTag(tag: string | undefined): HeadingTag {
  return HEADING_TAGS.find((heading) => heading === tag) ?? 'h2';
}

function toBlockStyle(node: SerializedRichTextNode) {
  const alignment = BLOCK_ALIGNMENTS.find((value) => value === node.format);

  return alignment ? { textAlign: alignment } : undefined;
}
