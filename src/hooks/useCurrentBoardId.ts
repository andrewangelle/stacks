import { useMatches, useParams } from '@tanstack/react-router';

type CardRouteLoaderData = {
  boardId: string;
  cardId: string;
};

export function useCurrentBoardId() {
  const params = useParams({ strict: false });
  const matches = useMatches();

  if (params.id) {
    return params.id;
  }

  const cardRouteMatch = matches.find(
    (match) => match.routeId === '/card/$cardId',
  );
  const loaderData = cardRouteMatch?.loaderData as
    | CardRouteLoaderData
    | undefined;

  return loaderData?.boardId ?? '';
}
