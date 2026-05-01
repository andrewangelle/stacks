import { createFileRoute } from '@tanstack/react-router';
import BoardPage from '~/routes/board/$id';

export const Route = createFileRoute('/board/$id')({
  component: BoardPage,
});
