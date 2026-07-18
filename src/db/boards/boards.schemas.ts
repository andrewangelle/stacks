import { z } from 'zod';

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
  boardColor: z.string(),
});

export const MaybeBoardIdSchema = z
  .object({
    boardId: z.string().optional(),
  })
  .optional();

export type CreateBoardArgs = z.infer<typeof CreateBoardSchema>;
export type GetBoardByIdArgs = z.infer<typeof GetBoardByIdSchema>;
export type UpdateBoardArgs = z.infer<typeof UpdateBoardSchema>;
export type MaybeBoardIdArgs = z.infer<typeof MaybeBoardIdSchema>;
