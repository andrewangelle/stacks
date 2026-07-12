import { EditableListName } from '~/components/Lists/EditableListName';
import { ListActions } from '~/components/Lists/ListActions/ListActions';
import { ListHeaderCardCount } from '~/components/Lists/ListHeaderCardCount';
import { Flex } from '~/styles/Page.styled';

export function ListHeader({ id: listId }: { id: string }) {
  return (
    <Flex
      style={{
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <EditableListName listId={listId} />

      <Flex data-testid="Flex" style={{ gap: '8px', alignItems: 'center' }}>
        <ListHeaderCardCount listId={listId} />
        <ListActions id={listId} />
      </Flex>
    </Flex>
  );
}
