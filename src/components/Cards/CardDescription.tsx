import { useState } from 'react';
import { IoMdList } from 'react-icons/io';
import { RiArrowRightSLine } from 'react-icons/ri';
import {
  CardDescriptionText,
  CloseDescriptionButton,
  DescriptionBody,
  DescriptionBodyInner,
  DescriptionCaretIcon,
  DescriptionContainer,
  DescriptionEditorContainer,
  DescriptionHeadingRow,
  DescriptionListIcon,
  DescriptionPlaceholder,
  DescriptionTitle,
  DescriptionToggleButton,
  EditDescriptionButton,
  SaveDescriptionButton,
} from '~/components/Cards/Card.styled';
import { RichTextContent } from '~/components/shared/RichText/RichTextContent';
import { RichTextEditor } from '~/components/shared/RichText/RichTextEditor';
import { isEmptyRichText } from '~/components/shared/RichText/richText';
import {
  useGetCardById,
  useSetDescriptionExpanded,
  useUpdateCard,
} from '~/db/cards/cards.query';
import { Flex } from '~/styles/Page.styled';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CardDescription() {
  const cardId = useCurrentCardId();
  const { data } = useGetCardById({ id: cardId });
  const setDescriptionExpanded = useSetDescriptionExpanded();
  const [isEditing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const updateCard = useUpdateCard();

  const placeHolderText = 'Add a more detailed description...';
  const description = data?.cardDescription ?? '';
  const isExpanded = data?.isDescriptionExpanded ?? true;
  const hasDescription = !isEmptyRichText(description);

  function editDescription() {
    setEditedDescription(description);
    setEditing(true);
  }

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
    <DescriptionContainer>
      <DescriptionHeadingRow>
        <Flex style={{ alignItems: 'center' }}>
          <DescriptionToggleButton
            $expanded={isExpanded}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded ? 'Collapse description' : 'Expand description'
            }
            onClick={toggleExpanded}
          >
            <DescriptionListIcon>
              <IoMdList size={24} />
            </DescriptionListIcon>

            <DescriptionCaretIcon $expanded={isExpanded}>
              <RiArrowRightSLine size={24} />
            </DescriptionCaretIcon>
          </DescriptionToggleButton>

          <DescriptionTitle>Description</DescriptionTitle>
        </Flex>

        {hasDescription && !isEditing && (
          <EditDescriptionButton
            $secondary
            $expanded={isExpanded}
            onClick={editDescription}
          >
            Edit
          </EditDescriptionButton>
        )}
      </DescriptionHeadingRow>

      <DescriptionBody $expanded={isExpanded}>
        <DescriptionBodyInner $expanded={isExpanded}>
          {hasDescription && !isEditing && (
            <CardDescriptionText onClick={() => setEditing(true)}>
              <RichTextContent value={description} />
            </CardDescriptionText>
          )}

          {!isEditing && !hasDescription && (
            <DescriptionPlaceholder onClick={editDescription}>
              {placeHolderText}
            </DescriptionPlaceholder>
          )}

          {isEditing && (
            <>
              <DescriptionEditorContainer>
                <RichTextEditor
                  initialValue={description}
                  placeholder={placeHolderText}
                  ariaLabel="Card description"
                  testId="DescriptionInput"
                  autoFocus
                  onChange={setEditedDescription}
                />
              </DescriptionEditorContainer>

              <Flex>
                <SaveDescriptionButton onClick={saveDescription}>
                  Save
                </SaveDescriptionButton>

                <CloseDescriptionButton
                  $secondary
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </CloseDescriptionButton>
              </Flex>
            </>
          )}
        </DescriptionBodyInner>
      </DescriptionBody>
    </DescriptionContainer>
  );
}
