import { createFileRoute } from '@tanstack/react-router';
import { SignIn } from '~/components/SignIn';

function SignInPage() {
  return <SignIn />;
}

export const Route = createFileRoute('/signin')({
  component: SignInPage,
});
