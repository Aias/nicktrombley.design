import { z } from 'zod';

export const ThemeSchema = z.enum(['light', 'dark']).optional();
export type Theme = z.infer<typeof ThemeSchema>;
