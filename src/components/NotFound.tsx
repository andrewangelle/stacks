import * as Sentry from '@sentry/tanstackstart-react';
import type { NotFoundRouteProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NavBarClient } from '~/components/Nav/NavBarClient';
import { FlexCenter } from '~/styles/Page.styled';

export function NotFound(props: NotFoundRouteProps) {
  useEffect(() => {
    Sentry.captureException(props);
  }, [props]);

  return (
    <>
      <NavBarClient />
      <FlexCenter data-testid="FlexCenter">
        <h1>Page not found</h1>
      </FlexCenter>
    </>
  );
}
