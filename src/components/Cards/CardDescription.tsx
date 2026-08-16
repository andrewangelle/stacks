import { useState } from 'react';
import { IoMdList } from 'react-icons/io';
import {
  CardDescriptionText,
  CloseDescriptionButton,
  DescriptionContainer,
  DescriptionEditorContainer,
  DescriptionHeadingRow,
  DescriptionPlaceholder,
  DescriptionTitle,
  EditDescriptionButton,
  SaveDescriptionButton,
} from '~/components/Cards/Card.styled';
import { RichTextContent } from '~/components/shared/RichText/RichTextContent';
import { RichTextEditor } from '~/components/shared/RichText/RichTextEditor';
import { isEmptyRichText } from '~/components/shared/RichText/richText';
import { useGetCardById, useUpdateCard } from '~/db/cards/cards.query';
import { Flex } from '~/styles/Page.styled';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CardDescription() {
  const cardId = useCurrentCardId();
  const { data } = useGetCardById({ id: cardId });
  const [isEditing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const updateCard = useUpdateCard();

  const placeHolderText = 'Add a more detailed description...';
  const description = data?.cardDescription ?? '';
  const hasDescription = !isEmptyRichText(description);

  function editDescription() {
    setEditedDescription(description);
    setEditing(true);
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
          <IoMdList size={24} />

          <DescriptionTitle>Description</DescriptionTitle>
        </Flex>

        {hasDescription && !isEditing && (
          <EditDescriptionButton $secondary onClick={editDescription}>
            Edit
          </EditDescriptionButton>
        )}
      </DescriptionHeadingRow>

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
    </DescriptionContainer>
  );
}
