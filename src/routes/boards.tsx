import { createFileRoute } from '@tanstack/react-router';
import BoardsPage from '~/routes/boards';

export const Route = createFileRoute('/boards')({
  component: BoardsPage,
});
