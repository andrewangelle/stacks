import { CardTitleDetails } from '~/components/Lists/CardTitleDetails/CardTitleDetails';
import { ListCardSkeleton } from '~/components/Lists/List.styled';
import { useGetCardById } from '~/db/cards/cards.query';

export function ListCard({ id }: { id: string }) {
  const { isLoading } = useGetCardById({ id });

  if (isLoading) {
    return <ListCardSkeleton />;
  }

  return <CardTitleDetails id={id} />;
}
