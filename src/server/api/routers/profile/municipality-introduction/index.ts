import { createTRPCRouter } from "@/server/api/trpc";
import { municipalitySlopeRouter } from "./municipality-slope.procedure";
import { municipalityAspectRouter } from "./municipality-aspect.procedure";

export const municipalityIntroductionRouter = createTRPCRouter({
  municipalitySlope: municipalitySlopeRouter,
  municipalityAspect: municipalityAspectRouter,
  // Add other municipality introduction related routers here in the future
});
