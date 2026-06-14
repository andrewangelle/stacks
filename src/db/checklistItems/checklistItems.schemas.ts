import { z } from 'zod';

export const GetChecklistItemsSchema = z.object({
  checklistId: z.string(),
});

export const GetChecklistItemByIdSchema = z.object({
  itemId: z.string(),
});

export const CreateChecklistItemSchema = z.object({
  label: z.string(),
  cardId: z.string(),
  checklistId: z.string(),
  listId: z.string(),
});

export const UpdateChecklistItemSchema = z.object({
  itemId: z.string(),
  label: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export const DeleteChecklistItemSchema = z.object({
  itemId: z.string(),
});

export const ReorderChecklistItemsSchema = z.object({
  checklistId: z.string(),
  orderedIds: z.array(z.string()),
});

export const MoveChecklistItemSchema = z.object({
  itemId: z.string(),
  sourceChecklistId: z.string(),
  targetChecklistId: z.string(),
  targetIndex: z.number().int().min(0),
});

export type GetChecklistItemsArgs = z.infer<typeof GetChecklistItemsSchema>;
export type GetChecklistItemByIdArgs = z.infer<
  typeof GetChecklistItemByIdSchema
>;
export type CreateChecklistItemArgs = z.infer<typeof CreateChecklistItemSchema>;
export type UpdateChecklistItemArgs = z.infer<typeof UpdateChecklistItemSchema>;
export type DeleteChecklistItemArgs = z.infer<typeof DeleteChecklistItemSchema>;
export type ReorderChecklistItemsArgs = z.infer<
  typeof ReorderChecklistItemsSchema
>;
export type MoveChecklistItemArgs = z.infer<typeof MoveChecklistItemSchema>;
