import { useState } from 'react';
import { IoMdList } from 'react-icons/io';
import { RiArrowRightSLine } from 'react-icons/ri';
import {
  CardDescriptionBody,
  CardDescriptionBodyInner,
  CardDescriptionCaretIcon,
  CardDescriptionContainer,
  CardDescriptionEditorContainer,
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
  const [editedDescription, setEditedDescription] = useState('');
  // Lexical seeds itself from `initialValue` once, on mount, so discarding a
  // draft means remounting the editor rather than handing it a new value.
  const [editorSession, setEditorSession] = useState(0);
  const updateCard = useUpdateCard();

  const placeHolderText = 'Add a more detailed description...';
  const description = data?.cardDescription ?? '';
  const isExpanded = data?.isDescriptionExpanded ?? true;
  const hasDescription = !isEmptyRichText(description);
  const hasUnsavedChanges = isEditing && editedDescription !== description;

  function editDescription() {
    setEditedDescription(description);
    setEditing(true);
  }

  function discardChanges() {
    setEditedDescription(description);
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
      cardDescription: editedDescription,
      listId: data?.listId ?? '',
    });
    setEditing(false);
  }

  return (
    <CardDescriptionContainer>
      <CardDescriptionHeadingRow>
        <Flex style={{ alignItems: 'center' }}>
          <CardDescriptionToggleButton
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

            <CardDescriptionCaretIcon $expanded={isExpanded}>
              <RiArrowRightSLine size={24} />
            </CardDescriptionCaretIcon>
          </CardDescriptionToggleButton>

          <CardDescriptionTitle>Description</CardDescriptionTitle>
        </Flex>

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
                  initialValue={description}
                  placeholder={placeHolderText}
                  ariaLabel="Card description"
                  testId="DescriptionInput"
                  autoFocus
                  onChange={setEditedDescription}
                />
              </CardDescriptionEditorContainer>

              <Flex>
                <SaveDescriptionButton onClick={saveDescription}>
                  Save
                </SaveDescriptionButton>

                <CloseDescriptionButton
                  $secondary
                  onClick={
                    hasUnsavedChanges ? discardChanges : () => setEditing(false)
                  }
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
