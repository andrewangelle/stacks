import { CardModalTrigger } from '~/components/Cards/Card.styled';
import { CardTitleChecklistDetails } from '~/components/Cards/CardTitleChecklistsDetails';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { useGetCardById } from '~/query/cards';
import { useGetCardChecklistView } from '~/query/checklists';

export function CardTitle({ id }: { id: string }) {
  const { data } = useGetCardById({ id });
  const { isSuccess, data: checklistViews } = useGetCardChecklistView({
    cardId: id,
  });

  return (
    <CardModalTrigger data-testid="CardModalTrigger">
      <ListCardContainer data-testid="ListCardContainer">
        {data?.cardTitle}

        {isSuccess && checklistViews.totalItemsForCard > 0 && (
          <CardTitleChecklistDetails checklistViews={checklistViews} />
        )}
      </ListCardContainer>
    </CardModalTrigger>
  );
}
