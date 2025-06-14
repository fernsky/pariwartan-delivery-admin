import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { demographicSummary } from "@/server/db/schema/profile/demographics/ward-wise-demographic-summary";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Get demographic summary data
const getDemographicSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Get the singleton demographic summary record
      const data = await ctx.db
        .select()
        .from(demographicSummary)
        .limit(1);

      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error fetching demographic summary data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve demographic summary data",
      });
    }
  });

// Export the router with the correct procedure structure
export const wardWiseDemographicSummaryRouter = createTRPCRouter({
  getAll: getDemographicSummary,
});

// Also export individual procedure for direct use if needed
export { getDemographicSummary };
