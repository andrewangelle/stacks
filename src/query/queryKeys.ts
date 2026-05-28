export const queryKeys = {
  boards: () => ['boards'] as const,
  board: (boardId: string) => ['board', boardId] as const,
  lists: (boardId: string) => ['lists', boardId] as const,
  list: (id: string) => ['list', id] as const,
  cards: (listId: string) => ['cards', listId] as const,
  card: (cardId: string) => ['card', cardId] as const,
  checklists: (cardId: string) => ['checklists', cardId] as const,
  checklist: (checklistId: string) => ['checklist', checklistId] as const,
  checklistItems: (checklistId: string) =>
    ['checklistItems', checklistId] as const,
  checklistItem: (checklistItemId: string) =>
    ['checklistItem', checklistItemId] as const,
  activity: (cardId: string) => ['activity', cardId] as const,
  profile: () => ['profile'] as const,
};
