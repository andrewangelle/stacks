import { EditableListName } from '~/components/Lists/EditableListName';
import { ListHeaderContainer } from '~/components/Lists/List.styled';
import { ListActions } from '~/components/Lists/ListActions/ListActions';
import { ListHeaderCardCount } from '~/components/Lists/ListHeaderCardCount';
import { Flex } from '~/styles/Page.styled';

export function ListHeader() {
  return (
    <ListHeaderContainer>
      <EditableListName />

      <Flex style={{ gap: '8px', alignItems: 'center' }}>
        <ListHeaderCardCount />
        <ListActions />
      </Flex>
    </ListHeaderContainer>
  );
}
