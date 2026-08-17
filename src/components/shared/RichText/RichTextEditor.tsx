import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  type InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useMemo, useState } from 'react';
import { richTextTheme } from '~/components/shared/RichText/RichText.constants';
import {
  RichTextBody,
  RichTextPlaceholder,
  RichTextSurface,
} from '~/components/shared/RichText/RichText.styled';
import {
  richTextNodes,
  richTextTransformers,
} from '~/components/shared/RichText/RichText.transformers';
import {
  $isBlankDocument,
  toInitialEditorState,
} from '~/components/shared/RichText/RichText.utils';
import { RichTextMarkdownPreview } from '~/components/shared/RichText/RichTextMarkdownPreview';
import { RichTextToolbar } from '~/components/shared/RichText/RichTextToolbar';

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

export function RichTextEditor({
  initialValue = '',
  placeholder,
  ariaLabel,
  testId,
  autoFocus = false,
  minHeight = '90px',
  onChange,
}: RichTextEditorProps) {
  const [isMarkdownVisible, setMarkdownVisible] = useState(false);

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
        <RichTextToolbar
          isMarkdownVisible={isMarkdownVisible}
          onToggleMarkdown={() => setMarkdownVisible(!isMarkdownVisible)}
        />

        <RichTextBody $minHeight={minHeight} $hidden={isMarkdownVisible}>
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

        {isMarkdownVisible && (
          <RichTextMarkdownPreview
            minHeight={minHeight}
            onClose={() => setMarkdownVisible(false)}
          />
        )}
      </RichTextSurface>

      {autoFocus && <AutoFocusPlugin />}
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <MarkdownShortcutPlugin transformers={richTextTransformers} />
      <OnChangePlugin
        ignoreSelectionChange
        onChange={(editorState) => {
          const isEmpty = editorState.read($isBlankDocument);

          onChange(isEmpty ? '' : JSON.stringify(editorState));
        }}
      />
    </LexicalComposer>
  );
}
