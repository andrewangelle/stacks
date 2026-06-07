import { CardTitleDetails } from '~/components/Cards/CardTitleDetails/CardTitleDetails';
import { ListCardSkeleton } from '~/components/Lists/List.styled';
import { useGetCardById } from '~/query/cards';

export function ListCard({ id }: { id: string }) {
  const { isLoading } = useGetCardById({ id });

  if (isLoading) {
    return <ListCardSkeleton />;
  }

  return <CardTitleDetails id={id} />;
}
