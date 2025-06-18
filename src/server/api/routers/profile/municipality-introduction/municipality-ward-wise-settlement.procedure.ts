import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { municipalityWardWiseSettlementInputSchema, type MunicipalityWardWiseSettlementResponse } from "./municipality-ward-wise-settlement.schema";
import { municipalityWardWiseSettlement } from "@/server/db/schema/profile/municpality-introduction/municipality-ward-wise-settlement";
import { eq } from "drizzle-orm";

export const municipalityWardWiseSettlementRouter = createTRPCRouter({
  get: publicProcedure
    .input(municipalityWardWiseSettlementInputSchema)
    .query(async ({ ctx, input }): Promise<MunicipalityWardWiseSettlementResponse> => {
      const settlementData = await ctx.db
        .select()
        .from(municipalityWardWiseSettlement)
        .where(eq(municipalityWardWiseSettlement.municipalityId, input.municipalityId));

      // Group settlements by ward
      const wardGroups = settlementData.reduce((acc, item) => {
        const wardKey = item.wardNumber;
        if (!acc[wardKey]) {
          acc[wardKey] = {
            ward_number: item.wardNumberNepali,
            ward_number_english: item.wardNumber.toString(),
            settlements: [],
          };
        }
        acc[wardKey].settlements.push(item.settlementName);
        return acc;
      }, {} as Record<number, { ward_number: string; ward_number_english: string; settlements: string[] }>);

      // Convert to array and sort by ward number
      const data = Object.keys(wardGroups)
        .map(wardKey => wardGroups[parseInt(wardKey)])
        .sort((a, b) => parseInt(a.ward_number_english) - parseInt(b.ward_number_english));

      return {
        title: "प्रमुख बस्तीहरूको विवरण",
        title_english: "Details of Main Settlements",
        data,
        metadata: {
          total_wards: data.length,
          column_headers: {
            nepali: ["वडा नं.", "मुख्य बस्तीहरूको विवरण"],
            english: ["Ward No.", "Details of Main Settlements"],
          },
        },
      };
    }),
});
