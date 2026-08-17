import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { Select } from 'radix-ui';
import { useCallback, useEffect, useState } from 'react';
import { FaRedo, FaUndo } from 'react-icons/fa';
import { RxCaretDown } from 'react-icons/rx';
import {
  ALIGNMENT_BUTTONS,
  BLOCK_TYPE_OPTIONS,
  initialToolbarState,
  TEXT_FORMAT_BUTTONS,
} from '~/components/shared/RichText/RichText.constants';
import {
  RichTextBlockSelectContent,
  RichTextBlockSelectItem,
  RichTextBlockSelectTrigger,
  RichTextBlockSelectValue,
  RichTextBlockSelectViewport,
  RichTextToolbarButton,
  RichTextToolbarDivider,
  RichTextToolbarGroup,
  RichTextToolbarRow,
} from '~/components/shared/RichText/RichText.styled';
import type { BlockType } from '~/components/shared/RichText/RichText.types';
import {
  createBlockNode,
  keepSelection,
  toBlockType,
} from '~/components/shared/RichText/RichText.utils';

export function RichTextToolbar() {
  const [editor] = useLexicalComposerContext();
  const [toolbar, setToolbar] = useState(initialToolbarState);

  const syncToolbar = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    const anchorNode = selection.anchor.getNode();
    const element = $isRootOrShadowRoot(anchorNode)
      ? anchorNode
      : anchorNode.getTopLevelElementOrThrow();

    // Read every node off the active editor state here: React runs the state
    // updater later, once that state is no longer the active one.
    const selectionState = {
      blockType: toBlockType(element),
      alignment: $isElementNode(element) ? element.getFormatType() : '',
      formats: {
        bold: selection.hasFormat('bold'),
        italic: selection.hasFormat('italic'),
        underline: selection.hasFormat('underline'),
      },
    };

    setToolbar((currentToolbar) => ({ ...currentToolbar, ...selectionState }));
  }, []);

  function changeBlockType(nextBlockType: BlockType) {
    if (nextBlockType === 'bullet' || nextBlockType === 'number') {
      editor.dispatchCommand(
        nextBlockType === 'bullet'
          ? INSERT_UNORDERED_LIST_COMMAND
          : INSERT_ORDERED_LIST_COMMAND,
        undefined,
      );
      editor.focus();
      return;
    }

    if (toolbar.blockType === 'bullet' || toolbar.blockType === 'number') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }

    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => createBlockNode(nextBlockType));
      }
    });

    editor.focus();
  }

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(syncToolbar);
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            syncToolbar();
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (canUndo) => {
            setToolbar((currentToolbar) => ({ ...currentToolbar, canUndo }));
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (canRedo) => {
            setToolbar((currentToolbar) => ({ ...currentToolbar, canRedo }));
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
    [editor, syncToolbar],
  );

  return (
    <RichTextToolbarRow>
      <Select.Root
        value={toolbar.blockType}
        onValueChange={(value) => {
          const option = BLOCK_TYPE_OPTIONS.find(
            (blockType) => blockType.value === value,
          );

          if (option) {
            changeBlockType(option.value);
          }
        }}
      >
        <RichTextBlockSelectTrigger aria-label="Text style">
          Tt
          <RichTextBlockSelectValue>
            <Select.Value />
          </RichTextBlockSelectValue>
          <Select.Icon asChild>
            <RxCaretDown size={18} />
          </Select.Icon>
        </RichTextBlockSelectTrigger>

        <Select.Portal>
          <RichTextBlockSelectContent position="popper" sideOffset={4}>
            <RichTextBlockSelectViewport>
              {BLOCK_TYPE_OPTIONS.map((option) => (
                <RichTextBlockSelectItem
                  key={option.value}
                  value={option.value}
                  data-block-type={option.value}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </RichTextBlockSelectItem>
              ))}
            </RichTextBlockSelectViewport>
          </RichTextBlockSelectContent>
        </Select.Portal>
      </Select.Root>

      <RichTextToolbarDivider />

      <RichTextToolbarGroup>
        <RichTextToolbarButton
          type="button"
          aria-label="Undo"
          disabled={!toolbar.canUndo}
          onMouseDown={keepSelection}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <FaUndo />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          type="button"
          aria-label="Redo"
          disabled={!toolbar.canRedo}
          onMouseDown={keepSelection}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <FaRedo />
        </RichTextToolbarButton>
      </RichTextToolbarGroup>

      <RichTextToolbarDivider />

      <RichTextToolbarGroup>
        {TEXT_FORMAT_BUTTONS.map(({ format, label, Icon }) => (
          <RichTextToolbarButton
            key={format}
            type="button"
            aria-label={label}
            aria-pressed={toolbar.formats[format]}
            $active={toolbar.formats[format]}
            onMouseDown={keepSelection}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
          >
            <Icon />
          </RichTextToolbarButton>
        ))}
      </RichTextToolbarGroup>

      <RichTextToolbarDivider />

      <RichTextToolbarGroup>
        {ALIGNMENT_BUTTONS.map(({ alignment, label, Icon }) => (
          <RichTextToolbarButton
            key={label}
            type="button"
            aria-label={label}
            aria-pressed={toolbar.alignment === alignment}
            $active={toolbar.alignment === alignment}
            onMouseDown={keepSelection}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment)
            }
          >
            <Icon />
          </RichTextToolbarButton>
        ))}
      </RichTextToolbarGroup>
    </RichTextToolbarRow>
  );
}
