import * as styles from '~/components/Lists/List.css';

export function ListSkeleton() {
  return (
    <div
      className={styles.listContainer({ isMobile: false })}
      data-testid="ListContainer"
    >
      <div
        className={styles.listHeaderSkeletonRow}
        data-testid="ListHeaderSkeletonRow"
      >
        <div
          className={styles.listNameSkeleton}
          data-testid="ListNameSkeleton"
        />
        <div
          className={styles.listCountSkeleton}
          data-testid="ListCountSkeleton"
        />
      </div>

      <div
        className={styles.listCardsSkeletonRow}
        data-testid="ListCardsSkeletonRow"
      >
        <div
          className={styles.listCardSkeleton}
          data-testid="ListCardSkeleton"
          style={{
            margin: '2px 0px 8px 8px',
            width: '245px',
            height: '30px',
          }}
        />
        <div
          className={styles.addListButtonSkeleton}
          data-testid="AddListButtonSkeleton"
        />
      </div>
    </div>
  );
}
