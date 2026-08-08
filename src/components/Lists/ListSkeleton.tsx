import {
  AddListButtonSkeleton,
  ListCardSkeleton,
  ListCardsSkeletonRow,
  ListContainer,
  ListCountSkeleton,
  ListHeaderSkeletonRow,
  ListNameSkeleton,
} from '~/components/Lists/List.styled';

export function ListSkeleton() {
  return (
    <ListContainer $isMobile={false}>
      <ListHeaderSkeletonRow>
        <ListNameSkeleton />
        <ListCountSkeleton />
      </ListHeaderSkeletonRow>

      <ListCardsSkeletonRow>
        <ListCardSkeleton
          style={{
            margin: '2px 0px 8px 8px',
            width: '245px',
            height: '30px',
          }}
        />
        <AddListButtonSkeleton />
      </ListCardsSkeletonRow>
    </ListContainer>
  );
}
