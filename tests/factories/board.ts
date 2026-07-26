import { faker } from '@faker-js/faker';
import type { BoardBackground } from '~/components/Boards/Boards.styled';

const BOARD_COLORS: BoardBackground[] = [
  'green',
  'lightGreen',
  'blue',
  'orange',
  'red',
];

export function buildBoard(overrides?: {
  boardTitle?: string;
  boardColor?: BoardBackground;
}) {
  return {
    boardTitle: overrides?.boardTitle ?? faker.company.buzzPhrase(),
    boardColor:
      overrides?.boardColor ?? faker.helpers.arrayElement(BOARD_COLORS),
  };
}
