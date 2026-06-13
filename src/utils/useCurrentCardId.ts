import { useParams } from '@tanstack/react-router';

export function useCurrentCardId() {
  const params = useParams({ strict: false });
  return params.cardId ?? '';
}
