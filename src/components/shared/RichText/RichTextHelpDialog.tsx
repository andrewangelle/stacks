import { Dialog } from 'radix-ui';
import { RxCross2 } from 'react-icons/rx';
import { MARKDOWN_SHORTCUTS } from '~/components/shared/RichText/RichText.constants';
import {
  RichTextHelpClose,
  RichTextHelpContent,
  RichTextHelpKey,
  RichTextHelpKeys,
  RichTextHelpOverlay,
  RichTextHelpRow,
  RichTextHelpSectionTitle,
  RichTextHelpTitle,
} from '~/components/shared/RichText/RichText.styled';

type RichTextHelpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RichTextHelpDialog({
  open,
  onOpenChange,
}: RichTextHelpDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <RichTextHelpOverlay>
          <RichTextHelpContent aria-describedby={undefined}>
            <RichTextHelpTitle>Editor help</RichTextHelpTitle>

            <RichTextHelpClose aria-label="Close editor help">
              <RxCross2 size={20} />
            </RichTextHelpClose>

            <RichTextHelpSectionTitle>Markdown</RichTextHelpSectionTitle>

            {MARKDOWN_SHORTCUTS.map(({ label, keys }) => (
              <RichTextHelpRow key={label}>
                <span>{label}</span>

                <RichTextHelpKeys>
                  {keys.map((key) => (
                    <RichTextHelpKey key={key}>{key}</RichTextHelpKey>
                  ))}
                </RichTextHelpKeys>
              </RichTextHelpRow>
            ))}
          </RichTextHelpContent>
        </RichTextHelpOverlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
