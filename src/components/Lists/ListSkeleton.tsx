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
    <ListContainer data-testid="ListContainer">
      <ListHeaderSkeletonRow data-testid="ListHeaderSkeletonRow">
        <ListNameSkeleton data-testid="ListNameSkeleton" />
        <ListCountSkeleton data-testid="ListCountSkeleton" />
      </ListHeaderSkeletonRow>

      <ListCardsSkeletonRow data-testid="ListCardsSkeletonRow">
        <ListCardSkeleton
          data-testid="ListCardSkeleton"
          style={{
            margin: '2px 0px 8px 8px',
            width: '245px',
            height: '30px',
          }}
        />
        <AddListButtonSkeleton data-testid="AddListButtonSkeleton" />
      </ListCardsSkeletonRow>
    </ListContainer>
  );
}
