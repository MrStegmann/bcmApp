import { z } from 'zod';

export const TeamSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .trim()
    .min(3, { message: "Team name must be at least 3 characters long." })
    .max(20, { message: "Team name must be at most 20 characters long." }),
  wins: z.number().int().nonnegative().default(0),
  losses: z.number().int().nonnegative().default(0),
  totalPlayers: z.number().int().nonnegative().default(0),
});

export type TeamInput = z.infer<typeof TeamSchema>;
