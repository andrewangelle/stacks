import * as Sentry from '@sentry/tanstackstart-react';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NavBarClient } from '~/components/Nav/NavBarClient';
import { FlexCenter } from '~/styles/Page.styled';

export function AppError(props: ErrorComponentProps) {
  useEffect(() => {
    Sentry.captureException(props);
  }, [props]);

  return (
    <>
      <NavBarClient />
      <FlexCenter data-testid="FlexCenter" style={{ flexDirection: 'column' }}>
        <h1>Yikes</h1>
        <p>Something went wrong</p>
      </FlexCenter>
    </>
  );
}
