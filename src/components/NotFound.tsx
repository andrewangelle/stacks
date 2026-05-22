import * as Sentry from '@sentry/tanstackstart-react';
import type { NotFoundRouteProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NavBar } from '~/components/NavBar';
import { FlexCenter } from '~/styles/Page.styled';

export function NotFound(props: NotFoundRouteProps) {
  useEffect(() => {
    Sentry.captureException(props);
  }, [props]);

  return (
    <>
      <NavBar />
      <FlexCenter data-testid="FlexCenter">
        <h1>Page not found</h1>
      </FlexCenter>
    </>
  );
}
