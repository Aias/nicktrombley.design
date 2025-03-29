import { z } from 'zod';

export const WidgetsSchema = z.object({
	id: z.string(),
	xLg: z.coerce.number().optional(),
	yLg: z.coerce.number().optional(),
	xSm: z.coerce.number().optional(),
	ySm: z.coerce.number().optional(),
	width: z.coerce.number(),
	height: z.coerce.number(),
	screens: z.enum(['large', 'small', 'all']),
	xLgCells: z.coerce.number(),
	yLgCells: z.coerce.number(),
	xSmCells: z.coerce.number(),
	ySmCells: z.coerce.number(),
	widthCells: z.coerce.number(),
	heightCells: z.coerce.number(),
});
// Create a type from the Zod schema
export type Widget = z.infer<typeof WidgetsSchema>;

export const REMS_PER_CELL = 2;
