import { z } from 'zod';

export const WidgetsSchema = z.object({
	title: z.string(),
	summary: z
		.string()
		.optional()
		.transform((val) => val || undefined),
	widget: z.string(),
	x: z.coerce.number(),
	y: z.coerce.number(),
	width: z.coerce.number(),
	height: z.coerce.number(),
});
// Create a type from the Zod schema
export type Widget = z.infer<typeof WidgetsSchema>;
