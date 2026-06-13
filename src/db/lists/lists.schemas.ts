import { z } from 'zod';

export const GetListsSchema = z.object({
  boardId: z.string(),
});

export const GetListByIdSchema = z.object({
  id: z.string(),
});

export const CreateListSchema = z.object({
  boardId: z.string(),
  listTitle: z.string(),
});

export const UpdateListSchema = z.object({
  boardId: z.string(),
  listId: z.string(),
  listTitle: z.string(),
});

export const DeleteListSchema = z.object({
  boardId: z.string(),
  listId: z.string(),
});

export const ReorderListsSchema = z.object({
  boardId: z.string(),
  orderedIds: z.array(z.string()),
});

export type GetListsArgs = z.infer<typeof GetListsSchema>;
export type GetListByIdArgs = z.infer<typeof GetListByIdSchema>;
export type CreateListArgs = z.infer<typeof CreateListSchema>;
export type UpdateListArgs = z.infer<typeof UpdateListSchema>;
export type DeleteListArgs = z.infer<typeof DeleteListSchema>;
export type ReorderListsArgs = z.infer<typeof ReorderListsSchema>;
