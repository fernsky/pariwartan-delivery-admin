import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { municipalityAspectInputSchema, type MunicipalityAspectResponse } from "./municipality-aspect.schema";
import { municipalityAspect } from "@/server/db/schema/profile/municpality-introduction/municipality-aspect";
import { eq } from "drizzle-orm";

export const municipalityAspectRouter = createTRPCRouter({
  get: publicProcedure
    .input(municipalityAspectInputSchema)
    .query(async ({ ctx, input }): Promise<MunicipalityAspectResponse> => {
      const aspectData = await ctx.db
        .select()
        .from(municipalityAspect)
        .where(eq(municipalityAspect.municipalityId, input.municipalityId));

      // Calculate totals
      const totalAreaSqKm = aspectData.reduce(
        (sum, item) => sum + parseFloat(item.areaSqKm),
        0
      );
      const totalPercentage = aspectData.reduce(
        (sum, item) => sum + parseFloat(item.areaPercentage),
        0
      );

      // Find highest and lowest area
      const sortedByArea = aspectData.sort((a, b) => parseFloat(b.areaSqKm) - parseFloat(a.areaSqKm));
      const highestArea = sortedByArea[0];
      const lowestArea = sortedByArea[sortedByArea.length - 1];

      return {
        title: "मोहोडा अनुसार क्षेत्रफल विवरण",
        title_english: "Area Distribution by Aspect (Direction)",
        data: aspectData.map((item) => ({
          direction_nepali: item.directionNepali,
          direction_english: item.directionEnglish,
          area_sq_km: parseFloat(item.areaSqKm),
          area_percentage: parseFloat(item.areaPercentage),
        })),
        total: {
          area_sq_km: totalAreaSqKm,
          area_percentage: totalPercentage,
        },
        metadata: {
          column_headers: {
            nepali: ["मोहोडा", "क्षेत्रफल (वर्ग कि.मि.)", "क्षेत्रफल (प्रतिशत)"],
            english: ["Aspect", "Area (sq. km.)", "Area (percentage)"],
          },
          highest_area: {
            direction: highestArea?.directionNepali || "",
            direction_english: highestArea?.directionEnglish || "",
            area_sq_km: parseFloat(highestArea?.areaSqKm || "0"),
            area_percentage: parseFloat(highestArea?.areaPercentage || "0"),
          },
          lowest_area: {
            direction: lowestArea?.directionNepali || "",
            direction_english: lowestArea?.directionEnglish || "",
            area_sq_km: parseFloat(lowestArea?.areaSqKm || "0"),
            area_percentage: parseFloat(lowestArea?.areaPercentage || "0"),
          },
        },
      };
    }),
});
