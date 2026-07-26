import { EditableListName } from '~/components/Lists/EditableListName';
import * as listStyles from '~/components/Lists/List.css';
import { ListActions } from '~/components/Lists/ListActions/ListActions';
import { ListHeaderCardCount } from '~/components/Lists/ListHeaderCardCount';
import * as pageStyles from '~/styles/Page.css';

export function ListHeader({ id: listId }: { id: string }) {
  return (
    <div
      className={listStyles.listHeaderContainer}
      data-testid="ListHeaderContainer"
    >
      <EditableListName listId={listId} />

      <div
        className={pageStyles.flex}
        data-testid="Flex"
        style={{ gap: '8px', alignItems: 'center' }}
      >
        <ListHeaderCardCount listId={listId} />
        <ListActions id={listId} />
      </div>
    </div>
  );
}
