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
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  type InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { $getRoot } from 'lexical';
import { useMemo } from 'react';
import {
  RichTextBody,
  RichTextPlaceholder,
  RichTextSurface,
} from '~/components/shared/RichText/RichText.styled';
import { RichTextToolbar } from '~/components/shared/RichText/RichTextToolbar';
import { toInitialEditorState } from '~/components/shared/RichText/richText';

/**
 * `initialValue` seeds the editor once, on mount: Lexical owns the document
 * from there. Remount with a `key` to load a different value, the way
 * `AddComment` empties itself after posting.
 */
type RichTextEditorProps = {
  initialValue?: string;
  placeholder: string;
  ariaLabel: string;
  testId: string;
  autoFocus?: boolean;
  minHeight?: string;
  onChange: (value: string) => void;
};

const richTextNodes = [HeadingNode, QuoteNode, ListNode, ListItemNode];

const richTextTransformers = [
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
const richTextTheme = {
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

export function RichTextEditor({
  initialValue = '',
  placeholder,
  ariaLabel,
  testId,
  autoFocus = false,
  minHeight = '90px',
  onChange,
}: RichTextEditorProps) {
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace: 'RichTextEditor',
      nodes: richTextNodes,
      theme: richTextTheme,
      editorState: toInitialEditorState(initialValue),
      onError(error: Error) {
        console.error(error);
      },
    }),
    [initialValue],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextSurface>
        <RichTextToolbar />

        <RichTextBody $minHeight={minHeight}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                data-testid={testId}
                aria-label={ariaLabel}
                aria-placeholder={placeholder}
                placeholder={
                  <RichTextPlaceholder>{placeholder}</RichTextPlaceholder>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </RichTextBody>
      </RichTextSurface>

      {autoFocus && <AutoFocusPlugin />}
      <HistoryPlugin />
      <ListPlugin />
      <MarkdownShortcutPlugin transformers={richTextTransformers} />
      <OnChangePlugin
        ignoreSelectionChange
        onChange={(editorState) => {
          const isEmpty = editorState.read(
            () => $getRoot().getTextContent().trim() === '',
          );

          onChange(isEmpty ? '' : JSON.stringify(editorState));
        }}
      />
    </LexicalComposer>
  );
}
