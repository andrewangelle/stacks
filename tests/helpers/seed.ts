import type { APIRequestContext } from '@playwright/test';
import type { BoardBackground } from '~/components/Boards/Boards.styled';

type SeededBoard = {
  id: string;
  boardTitle: string;
  boardColor: BoardBackground;
};

export async function seedBoard(
  request: APIRequestContext,
  boardTitle?: string,
  boardColor?: BoardBackground,
) {
  const response = await request.post('/__test/seed-board', {
    data: { boardTitle, boardColor },
  });

  if (!response.ok()) {
    throw new Error(`Failed to seed board: ${response.status()}`);
  }

  return (await response.json()) as SeededBoard;
}

type SeededCard = {
  list: { id: string; listTitle: string; boardId: string };
  card: { id: string; cardTitle: string; listId: string };
};

export async function seedCard(
  request: APIRequestContext,
  data: {
    boardId: string;
    listTitle?: string;
    cardTitle?: string;
  },
) {
  const response = await request.post('/__test/seed-card', { data });

  if (!response.ok()) {
    throw new Error(`Failed to seed card: ${response.status()}`);
  }

  return (await response.json()) as SeededCard;
}
