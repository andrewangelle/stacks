import { styled } from '@pigment-css/react';
import type { BackgroundProps } from '~/components/Boards/Boards.styled';
import { boardGradientVars, fontFamily, tokenShades } from '~/styles/tokens';

export const NavBarContainer = styled('div')({
  width: '100%',
  zIndex: 1,
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
});

export const NavBarContent = styled.div<BackgroundProps>({
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: '46px',
  variants: [
    {
      props: { background: 'blue' },
      style: {
        background: tokenShades.blue.darkest,
      },
    },
    {
      props: { background: 'green' },
      style: {
        background: tokenShades.green.darkest,
      },
    },
    {
      props: { background: 'lightGreen' },
      style: {
        background: tokenShades.lightGreen.darkest,
      },
    },
    {
      props: { background: 'orange' },
      style: {
        background: tokenShades.orange.darkest,
      },
    },
    {
      props: { background: 'red' },
      style: {
        background: tokenShades.red.darkest,
      },
    },
  ],
});

export const BoardBarContainer = styled(NavBarContainer)<BackgroundProps>({
  padding: '10px',
  zIndex: 1,
  position: 'relative',
  variants: [
    {
      props: { background: 'blue' },
      style: {
        background: tokenShades.blue.darker,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'green' },
      style: {
        background: tokenShades.green.darker,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'lightGreen' },
      style: {
        background: tokenShades.lightGreen.darker,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'orange' },
      style: {
        background: tokenShades.orange.darker,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'red' },
      style: {
        background: tokenShades.red.darker,
        borderBottom: '1px solid white',
      },
    },
  ],
});

type BoardPageBackgroundProps = {
  background?: string;
};

export const BoardPageBackground = styled('div')<BoardPageBackgroundProps>({
  height: '100vh',
  width: 'max-content',
  minWidth: '100vw',
  background: 'transparent',
  position: 'relative',
  top: 66,
  display: 'flex',
  padding: '50px 30px 30px',
  variants: [
    {
      props: { background: 'blue' },
      style: { background: boardGradientVars.blue },
    },
    {
      props: { background: 'green' },
      style: { background: boardGradientVars.green },
    },
    {
      props: { background: 'lightGreen' },
      style: { background: boardGradientVars.lightGreen },
    },
    {
      props: { background: 'orange' },
      style: { background: boardGradientVars.orange },
    },
    {
      props: { background: 'red' },
      style: { background: boardGradientVars.red },
    },
  ],
});

export const BoardTitle = styled.div`
  padding: 10px;
  cursor: pointer;
  display: inline-block;
  width: max-content;
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const EditBoardTitleForm = styled.form`
  width: max-content;
  height: 40px;
  position: relative;
  top: -5px;
`;

export const EditBoardTitleInput = styled.input` 
  font-family: ${fontFamily};
  font-weight: 500;
  font-size: 16px;
  border-radius: 0px;
  border: none;
  margin: 8px 0px 12px;
  padding: 10px;
`;
