import { createFileRoute } from '@tanstack/react-router';
import IndexPage from '~/routes/index';

export const Route = createFileRoute('/')({
  component: IndexPage,
});
