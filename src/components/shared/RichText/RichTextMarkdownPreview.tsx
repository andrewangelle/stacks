import { $convertToMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useMemo, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import {
  RichTextMarkdownPanel,
  RichTextMarkdownPanelButton,
  RichTextMarkdownPanelHeader,
  RichTextMarkdownSource,
} from '~/components/shared/RichText/RichText.styled';
import { richTextTransformers } from '~/components/shared/RichText/RichText.transformers';

type RichTextMarkdownPreviewProps = {
  minHeight: string;
  onClose: () => void;
};

/**
 * Mounted only while the preview is open, so reading the editor state once is
 * enough: the document behind it cannot change while it is on screen.
 */
export function RichTextMarkdownPreview({
  minHeight,
  onClose,
}: RichTextMarkdownPreviewProps) {
  const [editor] = useLexicalComposerContext();
  const [hasCopied, setHasCopied] = useState(false);

  const markdown = useMemo(
    () =>
      editor
        .getEditorState()
        .read(() => $convertToMarkdownString(richTextTransformers)),
    [editor],
  );

  useEffect(() => {
    if (!hasCopied) {
      return;
    }

    const timer = setTimeout(() => setHasCopied(false), 2000);

    return () => clearTimeout(timer);
  }, [hasCopied]);

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setHasCopied(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <RichTextMarkdownPanel $minHeight={minHeight}>
      <RichTextMarkdownPanelHeader>
        <RichTextMarkdownPanelButton
          type="button"
          aria-label="Copy markdown"
          onClick={copyMarkdown}
        >
          <FaRegCopy />
          {hasCopied ? 'Copied' : 'Copy'}
        </RichTextMarkdownPanelButton>

        <RichTextMarkdownPanelButton
          type="button"
          aria-label="Close markdown"
          onClick={onClose}
        >
          <RxCross2 size={18} />
        </RichTextMarkdownPanelButton>
      </RichTextMarkdownPanelHeader>

      <RichTextMarkdownSource>{markdown}</RichTextMarkdownSource>
    </RichTextMarkdownPanel>
  );
}
