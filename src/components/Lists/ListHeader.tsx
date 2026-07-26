import { EditableListName } from '~/components/Lists/EditableListName';
import { ListHeaderContainer } from '~/components/Lists/List.styled';
import { ListActions } from '~/components/Lists/ListActions/ListActions';
import { ListHeaderCardCount } from '~/components/Lists/ListHeaderCardCount';
import { Flex } from '~/styles/Page.styled';

export function ListHeader({ id: listId }: { id: string }) {
  return (
    <ListHeaderContainer data-testid="ListHeaderContainer">
      <EditableListName listId={listId} />

      <Flex data-testid="Flex" style={{ gap: '8px', alignItems: 'center' }}>
        <ListHeaderCardCount listId={listId} />
        <ListActions id={listId} />
      </Flex>
    </ListHeaderContainer>
  );
}
