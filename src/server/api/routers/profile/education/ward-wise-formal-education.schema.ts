import { z } from 'zod';

export const wardWiseFormalEducationSchema = z.object({
  id: z.number().optional(),
  ward: z.string().min(1, 'Ward is required'),
  gender: z.string().min(1, 'Gender is required'),
  total: z.number().int().nonnegative(),
  notMentioned: z.number().int().nonnegative(),
  currentlyAttending: z.number().int().nonnegative(),
  previouslyAttended: z.number().int().nonnegative(),
  neverAttended: z.number().int().nonnegative(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createWardWiseFormalEducationSchema = wardWiseFormalEducationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateWardWiseFormalEducationSchema = wardWiseFormalEducationSchema.partial().extend({
  id: z.number().int().positive(),
});

export const getWardWiseFormalEducationSchema = z.object({
  ward: z.string().optional(),
  gender: z.string().optional(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
});

export type WardWiseFormalEducationInput = z.infer<typeof createWardWiseFormalEducationSchema>;
export type WardWiseFormalEducationUpdate = z.infer<typeof updateWardWiseFormalEducationSchema>;
export type WardWiseFormalEducationFilter = z.infer<typeof getWardWiseFormalEducationSchema>;
