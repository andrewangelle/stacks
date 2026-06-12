import { z } from 'zod';

export const GetActivitySchema = z.object({
  cardId: z.string(),
});

export const GetActivityByIdSchema = z.object({
  activityId: z.string(),
});

export const CreateActivitySchema = z.object({
  listId: z.string(),
  cardId: z.string(),
  boardId: z.string(),
  content: z.string(),
  type: z.string(),
});

export const UpdateActivitySchema = z.object({
  cardId: z.string(),
  activityId: z.string(),
  content: z.string(),
});

export const DeleteActivitySchema = z.object({
  cardId: z.string(),
  activityId: z.string(),
});

export type GetActivityArgs = z.infer<typeof GetActivitySchema>;
export type GetActivityByIdArgs = z.infer<typeof GetActivityByIdSchema>;
export type CreateActivityArgs = z.infer<typeof CreateActivitySchema>;
export type UpdateActivityArgs = z.infer<typeof UpdateActivitySchema>;
export type DeleteActivityArgs = z.infer<typeof DeleteActivitySchema>;
