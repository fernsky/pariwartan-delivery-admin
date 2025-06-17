import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { wardWiseFormalEducation } from '@/server/db/schema/profile/education/ward-wise-formal-education';
import {
  createWardWiseFormalEducationSchema,
  updateWardWiseFormalEducationSchema,
  getWardWiseFormalEducationSchema,
} from './ward-wise-formal-education.schema';

export const wardWiseFormalEducationRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(getWardWiseFormalEducationSchema)
    .query(async ({ ctx, input }) => {
      const { ward, gender, limit, offset } = input;
      
      const conditions = [];
      if (ward) conditions.push(eq(wardWiseFormalEducation.ward, ward));
      if (gender) conditions.push(eq(wardWiseFormalEducation.gender, gender));

      return await ctx.db
        .select()
        .from(wardWiseFormalEducation)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(wardWiseFormalEducation.ward, wardWiseFormalEducation.gender);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(wardWiseFormalEducation)
        .where(eq(wardWiseFormalEducation.id, input.id))
        .limit(1);
      
      return result[0] ?? null;
    }),

  create: publicProcedure
    .input(createWardWiseFormalEducationSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(wardWiseFormalEducation)
        .values(input)
        .returning();
      
      return result[0];
    }),

  createMany: publicProcedure
    .input(z.array(createWardWiseFormalEducationSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(wardWiseFormalEducation)
        .values(input)
        .returning();
    }),

  update: publicProcedure
    .input(updateWardWiseFormalEducationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      const result = await ctx.db
        .update(wardWiseFormalEducation)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(wardWiseFormalEducation.id, id))
        .returning();
      
      return result[0];
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(wardWiseFormalEducation)
        .where(eq(wardWiseFormalEducation.id, input.id));
      
      return { success: true };
    }),

  getSummary: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db
        .select({
          ward: wardWiseFormalEducation.ward,
          totalCount: sql<number>`sum(${wardWiseFormalEducation.total})`,
          currentlyAttendingCount: sql<number>`sum(${wardWiseFormalEducation.currentlyAttending})`,
          previouslyAttendedCount: sql<number>`sum(${wardWiseFormalEducation.previouslyAttended})`,
          neverAttendedCount: sql<number>`sum(${wardWiseFormalEducation.neverAttended})`,
        })
        .from(wardWiseFormalEducation)
        .groupBy(wardWiseFormalEducation.ward)
        .orderBy(wardWiseFormalEducation.ward);
    }),
});
