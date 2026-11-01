import { z } from 'zod';

export const SetCommentsVisibleSchema = z.object({
  commentsVisible: z.boolean(),
});

export type SetCommentsVisibleArgs = z.infer<typeof SetCommentsVisibleSchema>;
