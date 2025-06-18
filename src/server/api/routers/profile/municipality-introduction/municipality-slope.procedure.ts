import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { municipalitySlopeInputSchema, type MunicipalitySlopeResponse } from "./municipality-slope.schema";
import { municipalitySlope } from "@/server/db/schema/profile/municpality-introduction/municipality-slope";
import { eq } from "drizzle-orm";

export const municipalitySlopeRouter = createTRPCRouter({
  get: publicProcedure
    .input(municipalitySlopeInputSchema)
    .query(async ({ ctx, input }): Promise<MunicipalitySlopeResponse> => {
      const slopeData = await ctx.db
        .select()
        .from(municipalitySlope)
        .where(eq(municipalitySlope.municipalityId, input.municipalityId));

      // Calculate totals
      const totalAreaSqKm = slopeData.reduce(
        (sum, item) => sum + parseFloat(item.areaSqKm),
        0
      );
      const totalPercentage = slopeData.reduce(
        (sum, item) => sum + parseFloat(item.areaPercentage),
        0
      );

      return {
        title: "भिरालोपन विवरण",
        title_english: "Slope Information",
        data: slopeData.map((item) => ({
          slope_range_nepali: item.slopeRangeNepali,
          slope_range_english: item.slopeRangeEnglish,
          area_sq_km: parseFloat(item.areaSqKm),
          area_percentage: parseFloat(item.areaPercentage),
        })),
        total: {
          total_area_sq_km: totalAreaSqKm,
          total_percentage: totalPercentage,
        },
        metadata: {
          column_headers: {
            nepali: ["भिरालोपन (डिग्रीमा)", "क्षेत्रफल (वर्ग कि.मि.)", "क्षेत्रफल (प्रतिशत)"],
            english: ["Slope (in degrees)", "Area (sq. km.)", "Area (percentage)"],
          },
          summary: slopeData.length > 0 
            ? `The majority of the area (${slopeData[0]?.areaPercentage}%) has a gentle slope of 0-5 degrees`
            : "No slope data available",
        },
      };
    }),
});
