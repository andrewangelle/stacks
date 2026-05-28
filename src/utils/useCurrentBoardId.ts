import { useParams } from '@tanstack/react-router';

export function useCurrentBoardId() {
  const params = useParams({ strict: false });
  return params.id ?? '';
}
