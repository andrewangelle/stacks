import { z } from 'zod';

export const GetChecklistsSchema = z.object({
  cardId: z.string(),
});

export const GetChecklistByIdSchema = z.object({
  checklistId: z.string(),
});

export const CreateChecklistSchema = z.object({
  checklistTitle: z.string(),
  cardId: z.string(),
  listId: z.string(),
});

export const DeleteChecklistSchema = z.object({
  checklistId: z.string(),
  cardId: z.string(),
});

export const UpdateChecklistSchema = z.object({
  checklistId: z.string(),
  cardId: z.string(),
  checklistTitle: z.string().optional(),
  hideCheckedItems: z.boolean().optional(),
});

export const ReorderChecklistsSchema = z.object({
  cardId: z.string(),
  orderedIds: z.array(z.string()),
});

export type GetChecklistsArgs = z.infer<typeof GetChecklistsSchema>;
export type GetChecklistByIdArgs = z.infer<typeof GetChecklistByIdSchema>;
export type CreateChecklistArgs = z.infer<typeof CreateChecklistSchema>;
export type DeleteChecklistArgs = z.infer<typeof DeleteChecklistSchema>;
export type UpdateChecklistArgs = z.infer<typeof UpdateChecklistSchema>;
export type ReorderChecklistsArgs = z.infer<typeof ReorderChecklistsSchema>;
