import { Popover } from 'radix-ui';
import { EditCardPopoverTriggerContainer } from '~/components/Lists/EditCardPopover/EditCardPopover.styled';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';

type EditCardPopoverTriggerProps = {
  isOpen: boolean;
  isInteractive: boolean;
};

export function EditCardPopoverTrigger({
  isOpen,
  isInteractive,
}: EditCardPopoverTriggerProps) {
  return (
    <Tooltip content="Edit card" disabled={isOpen}>
      <Popover.Trigger asChild>
        <EditCardPopoverTriggerContainer
          data-visible={isInteractive ? '' : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          <svg fill="none" viewBox="0 0 22 22" role="presentation">
            <path
              fill="currentcolor"
              fillRule="evenodd"
              d="M11.586.854a2 2 0 0 1 2.828 0l.732.732a2 2 0 0 1 0 2.828L10.01 9.551a2 2 0 0 1-.864.51l-3.189.91a.75.75 0 0 1-.927-.927l.91-3.189a2 2 0 0 1 .51-.864zm1.768 1.06a.5.5 0 0 0-.708 0l-.585.586L13.5 3.94l.586-.586a.5.5 0 0 0 0-.708zM12.439 5 11 3.56 7.51 7.052a.5.5 0 0 0-.128.216l-.54 1.891 1.89-.54a.5.5 0 0 0 .217-.127zM3 2.501a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V10H15v3.001a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h3v1.5z"
              clipRule="evenodd"
            />
          </svg>
        </EditCardPopoverTriggerContainer>
      </Popover.Trigger>
    </Tooltip>
  );
}
