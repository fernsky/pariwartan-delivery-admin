import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseDeliveryPlaces } from "@/server/db/schema/profile/fertility/ward-wise-delivery-place";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseDeliveryPlaceSchema,
  wardWiseDeliveryPlaceFilterSchema,
  updateWardWiseDeliveryPlaceSchema,
  DeliveryPlaceTypeEnum,
} from "./ward-wise-delivery-place.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise delivery places data with optional filtering
export const getAllWardWiseDeliveryPlaces = publicProcedure
  .input(wardWiseDeliveryPlaceFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseDeliveryPlaces);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseDeliveryPlaces.wardNumber, input.wardNumber),
          );
        }

        if (input?.deliveryPlace) {
          conditions.push(
            eq(wardWiseDeliveryPlaces.deliveryPlace, input.deliveryPlace),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and delivery place type
        data = await queryWithFilters.orderBy(
          wardWiseDeliveryPlaces.wardNumber,
          wardWiseDeliveryPlaces.deliveryPlace,
        );
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            ward_number,
            delivery_place,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_delivery_places
          ORDER BY 
            ward_number, delivery_place
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            deliveryPlace: row.delivery_place,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.deliveryPlace) {
            data = data.filter(
              (item) => item.deliveryPlace === input.deliveryPlace,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise delivery places data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseDeliveryPlacesByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseDeliveryPlaces)
      .where(eq(wardWiseDeliveryPlaces.wardNumber, input.wardNumber))
      .orderBy(wardWiseDeliveryPlaces.deliveryPlace);

    return data;
  });

// Create a new ward-wise delivery places entry
export const createWardWiseDeliveryPlace = protectedProcedure
  .input(wardWiseDeliveryPlaceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise delivery places data",
      });
    }

    // Check if entry already exists for this ward and delivery place type
    const existing = await ctx.db
      .select({ id: wardWiseDeliveryPlaces.id })
      .from(wardWiseDeliveryPlaces)
      .where(
        and(
          eq(wardWiseDeliveryPlaces.wardNumber, input.wardNumber),
          eq(wardWiseDeliveryPlaces.deliveryPlace, input.deliveryPlace),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and delivery place ${input.deliveryPlace} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseDeliveryPlaces).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      deliveryPlace: input.deliveryPlace,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise delivery places entry
export const updateWardWiseDeliveryPlace = protectedProcedure
  .input(updateWardWiseDeliveryPlaceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise delivery places data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    // Check if the record exists
    const existing = await ctx.db
      .select({ id: wardWiseDeliveryPlaces.id })
      .from(wardWiseDeliveryPlaces)
      .where(eq(wardWiseDeliveryPlaces.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseDeliveryPlaces)
      .set({
        wardNumber: input.wardNumber,
        deliveryPlace: input.deliveryPlace,
        population: input.population,
      })
      .where(eq(wardWiseDeliveryPlaces.id, input.id));

    return { success: true };
  });

// Delete a ward-wise delivery places entry
export const deleteWardWiseDeliveryPlace = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise delivery places data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseDeliveryPlaces)
      .where(eq(wardWiseDeliveryPlaces.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseDeliveryPlaceSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by delivery place type across all wards
      const summarySql = sql`
        SELECT 
          delivery_place, 
          SUM(population) as total_population
        FROM 
          ward_wise_delivery_places
        GROUP BY 
          delivery_place
        ORDER BY 
          delivery_place
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseDeliveryPlaceSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise delivery place summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseDeliveryPlacesRouter = createTRPCRouter({
  getAll: getAllWardWiseDeliveryPlaces,
  getByWard: getWardWiseDeliveryPlacesByWard,
  create: createWardWiseDeliveryPlace,
  update: updateWardWiseDeliveryPlace,
  delete: deleteWardWiseDeliveryPlace,
  summary: getWardWiseDeliveryPlaceSummary,
});
