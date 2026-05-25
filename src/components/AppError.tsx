import * as Sentry from '@sentry/tanstackstart-react';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NavBar } from '~/components/Nav/NavBar';
import { FlexCenter } from '~/styles/Page.styled';

export function AppError(props: ErrorComponentProps) {
  useEffect(() => {
    Sentry.captureException(props);
  }, [props]);

  return (
    <>
      <NavBar />
      <FlexCenter data-testid="FlexCenter">
        <h1>Yikes</h1>
        <p>Something went wrong</p>
      </FlexCenter>
    </>
  );
}
