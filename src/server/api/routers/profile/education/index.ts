import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseEducationalLevelRouter } from "./ward-wise-educational-level.procedure";
import { wardWiseLiteracyStatusRouter } from "./ward-wise-literacy-status.procedure";
import { wardWiseMajorSubjectRouter } from "./ward-wise-major-subject.procedure";
import { wardWiseSchoolDropoutRouter } from "./ward-wise-school-dropout.procedure";
import { wardWiseFormalEducationRouter } from "./ward-wise-formal-education.procedure";

export const educationRouter = createTRPCRouter({
  wardWiseEducationalLevel: wardWiseEducationalLevelRouter,
  wardWiseLiteracyStatus: wardWiseLiteracyStatusRouter,
  wardWiseMajorSubject: wardWiseMajorSubjectRouter,
  wardWiseSchoolDropout: wardWiseSchoolDropoutRouter,
  wardWiseFormalEducation: wardWiseFormalEducationRouter,
  // Add other education-related routers here in the future
});
