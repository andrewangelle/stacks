import { useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CardModal, DeleteListPopover, DragDropCard } from '~/components';
import {
  type List,
  tokenState,
  useCreateCardMutation,
  useGetCardsQuery,
  useUpdateListMutation,
} from '~/store';
import {
  AddCardButton,
  AddCardInput,
  AddCardText,
  CloseAddCardButton,
  Flex,
  ListContainer,
  ListName,
} from '~/styles';

export function useOutsideClick<ElementType = HTMLDivElement>(
  handler: (e: MouseEvent<ElementType>) => void,
  when = true,
) {
  const savedHandler = useRef(handler);

  const [node, setNode] = useState<Element | null>(null);

  const memoizedCallback = useCallback(
    (e: globalThis.MouseEvent) => {
      if (node && !node.contains(e.target as Element)) {
        savedHandler.current(e as unknown as MouseEvent<ElementType>);
      }
    },
    [node],
  );

  useEffect(() => {
    savedHandler.current = handler;
  });

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (when) {
      document.addEventListener('click', memoizedCallback);
    }
    return () => {
      document.removeEventListener('click', memoizedCallback);
    };
  }, [when, memoizedCallback]);

  return ref;
}

export function ListCard({ id, listTitle }: List) {
  const params = useParams({ strict: false });
  const [token] = useAtom(tokenState);
  const [isEditing, setEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [editedListTitle, setEditedListTitle] = useState(listTitle);
  const { data: cards } = useGetCardsQuery({ listId: id });
  const outsideClickRef = useOutsideClick(
    onOutsideNameEditClick,
    isEditingName,
  );
  const [updateList] = useUpdateListMutation();
  const [createCard] = useCreateCardMutation();

  function onOutsideNameEditClick() {
    setIsEditingName(false);

    if (editedListTitle !== listTitle) {
      updateList({
        boardId: params.id ?? '',
        listId: id,
        listTitle: editedListTitle,
        token: token?.access_token ?? '',
        userId: token?.user.id ?? '',
      });
    }
  }

  function onCardCreate() {
    createCard({
      cardTitle,
      listId: id,
      token: token?.access_token ?? '',
      userId: token?.user.id ?? '',
    });
    setEditing(false);
  }

  return (
    <ListContainer key={id}>
      <div ref={outsideClickRef}>
        {!isEditingName && (
          <ListName onClick={() => setIsEditingName(true)}>
            {listTitle}
          </ListName>
        )}

        {isEditingName && (
          <AddCardInput
            value={editedListTitle}
            onChange={(event) =>
              setEditedListTitle((_prevState) => event.target.value)
            }
          />
        )}
      </div>

      {!isEditingName && <DeleteListPopover id={id} listTitle={listTitle} />}

      {isEditing && (
        <AddCardInput
          value={cardTitle}
          onChange={(event) => setCardTitle((_prevState) => event.target.value)}
        />
      )}

      {cards?.map((card) => (
        <DragDropCard
          key={card.id}
          id={card.id}
          listId={id}
          cardTitle={card.cardTitle}
        >
          <CardModal {...card} listName={listTitle} listId={id} />
        </DragDropCard>
      ))}

      <Flex>
        {!isEditing && (
          <AddCardText onClick={() => setEditing(true)}>
            + Add a card
          </AddCardText>
        )}
        {isEditing && (
          <AddCardButton onClick={onCardCreate}>Add card</AddCardButton>
        )}
        {isEditing && (
          <CloseAddCardButton secondary onClick={() => setEditing(false)}>
            X
          </CloseAddCardButton>
        )}
      </Flex>
    </ListContainer>
  );
}
