import { useCallback, useRef, useState } from 'react';
import { IoMdList } from 'react-icons/io';
import { RiArrowRightSLine } from 'react-icons/ri';
import {
  CardDescriptionBody,
  CardDescriptionBodyInner,
  CardDescriptionCaretIcon,
  CardDescriptionContainer,
  CardDescriptionEditorContainer,
  CardDescriptionHeadingActions,
  CardDescriptionHeadingRow,
  CardDescriptionListIcon,
  CardDescriptionPlaceholder,
  CardDescriptionText,
  CardDescriptionTitle,
  CardDescriptionToggleButton,
  CloseDescriptionButton,
  EditDescriptionButton,
  SaveDescriptionButton,
  UnsavedChangesBadge,
} from '~/components/Cards/CardDescription/CardDescription.styled';
import { isEmptyRichText } from '~/components/shared/RichText/RichText.utils';
import { RichTextContent } from '~/components/shared/RichText/RichTextContent';
import { RichTextEditor } from '~/components/shared/RichText/RichTextEditor';
import {
  useGetCardById,
  useSetDescriptionExpanded,
  useUpdateCard,
} from '~/db/cards/cards.query';
import { Flex } from '~/styles/Page.styled';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { useDeliberateClick } from '~/utils/useDeliberateClick';

export function CardDescription() {
  const cardId = useCurrentCardId();
  const { data } = useGetCardById({ id: cardId });
  const setDescriptionExpanded = useSetDescriptionExpanded();
  const [isEditing, setEditing] = useState(false);
  // A draft outlives the editor: closing it leaves the badge up, and opening it
  // again seeds Lexical from the draft rather than the saved description.
  const [draft, setDraft] = useState<string | null>(null);
  // Lexical seeds itself from `initialValue` once, on mount, so discarding a
  // draft means remounting the editor rather than handing it a new value.
  const [editorSession, setEditorSession] = useState(0);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const updateCard = useUpdateCard();

  const placeHolderText = 'Add a more detailed description...';
  const description = data?.cardDescription ?? '';
  const isExpanded = data?.isDescriptionExpanded ?? true;
  const hasDescription = !isEmptyRichText(description);
  const hasUnsavedChanges = draft !== null && draft !== description;

  function editDescription() {
    setEditing(true);
  }

  const closeEditor = useCallback(() => {
    setEditing(false);
    toggleButtonRef.current?.focus();
  }, []);

  function discardChanges() {
    setDraft(null);
    setEditorSession(editorSession + 1);
  }

  // The saved description is selectable text, so opening the editor waits for a
  // click that is not part of a selection gesture.
  const descriptionClick = useDeliberateClick(editDescription);

  function toggleExpanded() {
    setDescriptionExpanded({ cardId, isDescriptionExpanded: !isExpanded });
  }

  function saveDescription() {
    updateCard({
      cardId,
      cardTitle: data?.cardTitle ?? '',
      cardDescription: draft ?? description,
      listId: data?.listId ?? '',
    });
    setDraft(null);
    setEditing(false);
  }

  return (
    <CardDescriptionContainer>
      <CardDescriptionHeadingRow>
        <Flex style={{ alignItems: 'center' }}>
          <CardDescriptionToggleButton
            ref={toggleButtonRef}
            $expanded={isExpanded}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded ? 'Collapse description' : 'Expand description'
            }
            onClick={toggleExpanded}
          >
            <CardDescriptionListIcon>
              <IoMdList size={24} />
            </CardDescriptionListIcon>

            <CardDescriptionCaretIcon>
              <RiArrowRightSLine size={24} />
            </CardDescriptionCaretIcon>
          </CardDescriptionToggleButton>

          <CardDescriptionTitle>Description</CardDescriptionTitle>
        </Flex>

        <CardDescriptionHeadingActions>
          {hasUnsavedChanges && (
            <UnsavedChangesBadge>Unsaved changes</UnsavedChangesBadge>
          )}

          {hasDescription && !isEditing && (
            <EditDescriptionButton
              $secondary
              $expanded={isExpanded}
              onClick={editDescription}
            >
              Edit
            </EditDescriptionButton>
          )}
        </CardDescriptionHeadingActions>
      </CardDescriptionHeadingRow>

      <CardDescriptionBody $expanded={isExpanded}>
        <CardDescriptionBodyInner $expanded={isExpanded}>
          {hasDescription && !isEditing && (
            <CardDescriptionText {...descriptionClick}>
              <RichTextContent value={description} />
            </CardDescriptionText>
          )}

          {!isEditing && !hasDescription && (
            <CardDescriptionPlaceholder onClick={editDescription}>
              {placeHolderText}
            </CardDescriptionPlaceholder>
          )}

          {isEditing && (
            <>
              <CardDescriptionEditorContainer>
                <RichTextEditor
                  key={editorSession}
                  initialValue={draft ?? description}
                  placeholder={placeHolderText}
                  ariaLabel="Card description"
                  testId="DescriptionInput"
                  autoFocus
                  onChange={setDraft}
                  onEscape={closeEditor}
                />
              </CardDescriptionEditorContainer>

              <Flex>
                <SaveDescriptionButton onClick={saveDescription}>
                  Save
                </SaveDescriptionButton>

                <CloseDescriptionButton
                  $secondary
                  onClick={hasUnsavedChanges ? discardChanges : closeEditor}
                >
                  {hasUnsavedChanges ? 'Discard changes' : 'Cancel'}
                </CloseDescriptionButton>
              </Flex>
            </>
          )}
        </CardDescriptionBodyInner>
      </CardDescriptionBody>
    </CardDescriptionContainer>
  );
}
