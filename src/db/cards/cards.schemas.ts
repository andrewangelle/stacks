import { z } from 'zod';

export const GetCardsByListIdSchema = z.object({
  listId: z.string(),
});

export const GetCardByIdSchema = z.object({
  cardId: z.string(),
});

export const CreateCardSchema = z.object({
  listId: z.string(),
  cardTitle: z.string(),
});

export const UpdateCardSchema = z.object({
  listId: z.string(),
  cardId: z.string(),
  cardDescription: z.string().optional(),
  cardTitle: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export const DeleteCardSchema = z.object({
  cardId: z.string(),
  listId: z.string(),
});

export type GetCardsByListIdArgs = z.infer<typeof GetCardsByListIdSchema>;
export type GetCardByIdArgs = z.infer<typeof GetCardByIdSchema>;
export type CreateCardArgs = z.infer<typeof CreateCardSchema>;
export type UpdateCardArgs = z.infer<typeof UpdateCardSchema>;
export type DeleteCardArgs = z.infer<typeof DeleteCardSchema>;
