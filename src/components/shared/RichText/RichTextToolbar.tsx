import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  type ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  type LexicalNode,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { type MouseEvent, useCallback, useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaRedo,
  FaUnderline,
  FaUndo,
} from 'react-icons/fa';
import {
  RichTextBlockSelect,
  RichTextToolbarButton,
  RichTextToolbarDivider,
  RichTextToolbarGroup,
  RichTextToolbarRow,
} from '~/components/shared/RichText/RichText.styled';

type BlockType = 'paragraph' | 'quote' | 'bullet' | 'number' | HeadingTagType;

type TextFormat = 'bold' | 'italic' | 'underline';

type BlockTypeOption = {
  value: BlockType;
  label: string;
};

type TextFormatButton = {
  format: TextFormat;
  label: string;
  Icon: IconType;
};

type AlignmentButton = {
  alignment: ElementFormatType;
  label: string;
  Icon: IconType;
};

const BLOCK_TYPE_OPTIONS: BlockTypeOption[] = [
  { value: 'paragraph', label: 'Normal' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'bullet', label: 'Bulleted list' },
  { value: 'number', label: 'Numbered list' },
  { value: 'quote', label: 'Quote' },
];

const TEXT_FORMAT_BUTTONS: TextFormatButton[] = [
  { format: 'bold', label: 'Bold', Icon: FaBold },
  { format: 'italic', label: 'Italic', Icon: FaItalic },
  { format: 'underline', label: 'Underline', Icon: FaUnderline },
];

const ALIGNMENT_BUTTONS: AlignmentButton[] = [
  { alignment: 'left', label: 'Align left', Icon: FaAlignLeft },
  { alignment: 'center', label: 'Align center', Icon: FaAlignCenter },
  { alignment: 'right', label: 'Align right', Icon: FaAlignRight },
  { alignment: 'justify', label: 'Justify', Icon: FaAlignJustify },
];

const initialToolbarState = {
  blockType: 'paragraph' as BlockType,
  alignment: '' as ElementFormatType,
  formats: { bold: false, italic: false, underline: false },
  canUndo: false,
  canRedo: false,
};

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

  return (
    <RichTextToolbarRow>
      <RichTextBlockSelect
        aria-label="Text style"
        value={toolbar.blockType}
        onChange={(event) => {
          const option = BLOCK_TYPE_OPTIONS.find(
            (blockType) => blockType.value === event.target.value,
          );

          if (option) {
            changeBlockType(option.value);
          }
        }}
      >
        {BLOCK_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </RichTextBlockSelect>

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

function toBlockType(element: LexicalNode): BlockType {
  if ($isListNode(element)) {
    return element.getListType() === 'number' ? 'number' : 'bullet';
  }

  if ($isQuoteNode(element)) {
    return 'quote';
  }

  if ($isHeadingNode(element)) {
    const tag = element.getTag();

    return BLOCK_TYPE_OPTIONS.some((option) => option.value === tag)
      ? tag
      : 'paragraph';
  }

  return 'paragraph';
}

function createBlockNode(blockType: Exclude<BlockType, 'bullet' | 'number'>) {
  if (blockType === 'quote') {
    return $createQuoteNode();
  }

  if (blockType === 'paragraph') {
    return $createParagraphNode();
  }

  return $createHeadingNode(blockType);
}

/** Toolbar clicks must not pull focus, or the selection they act on is gone. */
function keepSelection(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}
