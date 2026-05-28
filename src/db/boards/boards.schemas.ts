import { z } from 'zod';

export const GetBoardsSchema = z.object({});

export const CreateBoardSchema = z.object({
  boardTitle: z.string(),
  boardColor: z.string(),
});

export const GetBoardByIdSchema = z.object({
  boardId: z.string(),
});

export const UpdateBoardSchema = z.object({
  boardId: z.string(),
  boardTitle: z.string(),
});

export type GetBoardsArgs = z.infer<typeof GetBoardsSchema>;
export type CreateBoardArgs = z.infer<typeof CreateBoardSchema>;
export type GetBoardByIdArgs = z.infer<typeof GetBoardByIdSchema>;
export type UpdateBoardArgs = z.infer<typeof UpdateBoardSchema>;
