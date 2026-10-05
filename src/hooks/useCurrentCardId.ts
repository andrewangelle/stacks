import { useMatches, useParams } from '@tanstack/react-router';

type CardRouteLoaderData = {
  boardId: string;
  cardId: string;
};

export function useCurrentCardId() {
  const params = useParams({ strict: false });
  const matches = useMatches();

  const cardRouteMatch = matches.find(
    (match) => match.routeId === '/card/$cardId',
  );
  const loaderData = cardRouteMatch?.loaderData as
    | CardRouteLoaderData
    | undefined;

  // On the masked `/card/$cardId` route the path param is a truncated
  // 8-char id, so prefer the full id resolved by the route loader.
  return loaderData?.cardId ?? params.cardId ?? '';
}
