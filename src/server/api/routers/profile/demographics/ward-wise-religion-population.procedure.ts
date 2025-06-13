import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { religionPopulation } from "@/server/db/schema/profile/demographics/ward-wise-religion-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  religionPopulationSchema,
  religionPopulationFilterSchema,
  updateReligionPopulationSchema,
  ReligionTypeEnum,
} from "./ward-wise-religion-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all religion population data with optional filtering
export const getAllReligionPopulation = publicProcedure
  .input(religionPopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      let data: any[];
      try {
        const baseQuery = ctx.db.select().from(religionPopulation);

        let conditions = [];
        if (input?.religionType) {
          conditions.push(eq(religionPopulation.religionType, input.religionType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        data = await queryWithFilters.orderBy(religionPopulation.religionType);
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            religion_type as "religionType",
            male_population as "malePopulation",
            female_population as "femalePopulation", 
            total_population as "totalPopulation",
            percentage,
            updated_at as "updatedAt",
            created_at as "createdAt"
          FROM 
            acme_religion_population
          ORDER BY 
            religion_type
        `;

        data = await ctx.db.execute(acmeSql);
      }

      return data;
    } catch (error) {
      console.error("Error fetching religion population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific religion
export const getReligionPopulationByReligion = publicProcedure
  .input(z.object({ religionType: ReligionTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(religionPopulation)
      .where(eq(religionPopulation.religionType, input.religionType));

    return data;
  });

// Create a new religion population entry
export const createReligionPopulation = protectedProcedure
  .input(religionPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create religion population data",
      });
    }

    const existing = await ctx.db
      .select({ id: religionPopulation.id })
      .from(religionPopulation)
      .where(eq(religionPopulation.religionType, input.religionType))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for religion type ${input.religionType} already exists`,
      });
    }

    await ctx.db.insert(religionPopulation).values({
      id: input.id || uuidv4(),
      religionType: input.religionType,
      malePopulation: input.malePopulation,
      femalePopulation: input.femalePopulation,
      totalPopulation: input.totalPopulation,
      percentage: input.percentage,
    });

    return { success: true };
  });

// Update an existing religion population entry
export const updateReligionPopulation = protectedProcedure
  .input(updateReligionPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update religion population data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    const existing = await ctx.db
      .select({ id: religionPopulation.id })
      .from(religionPopulation)
      .where(eq(religionPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    await ctx.db
      .update(religionPopulation)
      .set({
        religionType: input.religionType,
        malePopulation: input.malePopulation,
        femalePopulation: input.femalePopulation,
        totalPopulation: input.totalPopulation,
        percentage: input.percentage,
      })
      .where(eq(religionPopulation.id, input.id));

    return { success: true };
  });

// Delete a religion population entry
export const deleteReligionPopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete religion population data",
      });
    }

    await ctx.db
      .delete(religionPopulation)
      .where(eq(religionPopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getReligionPopulationSummary = publicProcedure.query(async ({ ctx }) => {
  try {
    const summarySql = sql`
      SELECT 
        religion_type as "religionType",
        male_population as "malePopulation",
        female_population as "femalePopulation",
        total_population as "totalPopulation",
        percentage
      FROM 
        acme_religion_population
      ORDER BY 
        total_population DESC
    `;

    const summaryData = await ctx.db.execute(summarySql);
    return summaryData;
  } catch (error) {
    console.error("Error in getReligionPopulationSummary:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve religion population summary",
    });
  }
});

export const wardWiseReligionPopulationRouter = createTRPCRouter({
  getAll: getAllReligionPopulation,
  getByReligion: getReligionPopulationByReligion,
  create: createReligionPopulation,
  update: updateReligionPopulation,
  delete: deleteReligionPopulation,
  summary: getReligionPopulationSummary,
  // Legacy endpoints
  getByGender: getReligionPopulationByReligion,
  getByWard: getReligionPopulationByReligion,
});
