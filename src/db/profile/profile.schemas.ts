import { z } from 'zod';

export const GetProfileSchema = z.object({});

export type GetProfileArgs = z.infer<typeof GetProfileSchema>;
