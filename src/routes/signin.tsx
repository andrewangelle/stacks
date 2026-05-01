import { createFileRoute } from '@tanstack/react-router';
import SignInPage from '~/routes/signin';

export const Route = createFileRoute('/signin')({
  component: SignInPage,
});
