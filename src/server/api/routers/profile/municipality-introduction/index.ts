import { createTRPCRouter } from "@/server/api/trpc";
import { municipalitySlopeRouter } from "./municipality-slope.procedure";
import { municipalityAspectRouter } from "./municipality-aspect.procedure";
import {municipalityWardWiseSettlementRouter} from "./municipality-ward-wise-settlement.procedure";

export const municipalityIntroductionRouter = createTRPCRouter({
  municipalitySlope: municipalitySlopeRouter,
  municipalityAspect: municipalityAspectRouter,
  municipalityWardWiseSettlement: municipalityWardWiseSettlementRouter,
  // Add other municipality introduction related routers here in the future
});
