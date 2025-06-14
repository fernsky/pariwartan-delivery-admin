import { createTRPCRouter } from "@/server/api/trpc";
import { demographicSummaryRouter } from "./demographic-summary.procedure";
import { familyMainOccupationRouter } from "../demographics/ward-wise-major-occupation.procedure";
import { wardGenderWiseEconomicallyActivePopulationRouter } from "./ward-gender-wise-economically-active-population.procedure";
import { wardTimeSeriesRouter } from "./ward-time-series.procedure";
import { wardWiseDemographicSummaryRouter } from "./ward-wise-demographic-summary.procedure";
import { birthplaceHouseholdsRouter } from "./ward-wise-birthplace-households.procedure";
import { castePopulationRouter } from "./caste-population.procedure";
import {ageWisePopulationRouter} from "./age-wise-population.procedure";
import { ageHouseHeadGenderRouter } from "./ward-wise-househead-gender.procedure";
import { motherTonguePopulationRouter } from "./ward-wise-mother-tongue-population.procedure";
import { wardWiseReligionPopulationRouter } from "./ward-wise-religion-population.procedure";
import { wardAgeWiseMaritalStatusRouter } from "./ward-age-wise-marital-status.procedure";
import { wardAgeGenderWiseMarriedAgeRouter } from "./ward-age-gender-wise-married-age.procedure";
import { wardAgeGenderWiseAbsenteeRouter } from "./ward-age-gender-wise-absentee.procedure";
import { wardWiseAbsenteeEducationalLevelRouter } from "./ward-wise-absentee-educational-level.procedure";
import { wardWiseEducationalLevelRouter } from "../education/ward-wise-educational-level.procedure";
import { wardWiseLiteracyStatusRouter } from "../education/ward-wise-literacy-status.procedure";
import { wardWiseMajorSubjectRouter } from "../education/ward-wise-major-subject.procedure";
import { wardWiseSchoolDropoutRouter } from "../education/ward-wise-school-dropout.procedure";
import { disabilityByAgeRouter } from "./ward-wise-disability-cause.procedure";
import { wardWiseMigratedHouseholdsRouter } from "./ward-wise-migrated-households.procedure";
import { wardWiseBirthCertificatePopulationRouter } from "./ward-wise-birth-certificate-population.procedure";
import {wardAgeGenderWiseDeceasedPopulationRouter} from "./ward-age-gender-wise-deceased-population.procedure";
import { wardWiseDeathCauseRouter } from "./ward-wise-death-cause.procedure";
import { birthplaceHouseholds } from "@/server/db/schema";

export const demographicsRouter = createTRPCRouter({
  summary: demographicSummaryRouter,
  wardTimeSeries: wardTimeSeriesRouter,
  wardWiseDemographicSummary: wardWiseDemographicSummaryRouter,
  ageWisePopulation: ageWisePopulationRouter,
  castePopulation: castePopulationRouter,
  motherTonguePopulation: motherTonguePopulationRouter,
  disabilityByAge: disabilityByAgeRouter,
  wardWiseReligionPopulation: wardWiseReligionPopulationRouter,
  wardAgeWiseMaritalStatus: wardAgeWiseMaritalStatusRouter,
  wardAgeGenderWiseMarriedAge: wardAgeGenderWiseMarriedAgeRouter,
  wardGenderWiseEconomicallyActivePopulation: wardGenderWiseEconomicallyActivePopulationRouter,
  wardAgeGenderWiseAbsentee: wardAgeGenderWiseAbsenteeRouter,
  wardWiseAbsenteeEducationalLevel: wardWiseAbsenteeEducationalLevelRouter,
  wardWiseEducationalLevel: wardWiseEducationalLevelRouter,
  wardWiseLiteracyStatus: wardWiseLiteracyStatusRouter,
  ageGroupHouseHeadGender: ageHouseHeadGenderRouter,
  wardWiseMajorSubject: wardWiseMajorSubjectRouter,
  wardWiseSchoolDropout: wardWiseSchoolDropoutRouter,
  familyMainOccupation: familyMainOccupationRouter,
  birthplaceHouseholds: birthplaceHouseholdsRouter,
  wardWiseBirthCertificatePopulation: wardWiseBirthCertificatePopulationRouter,
  wardAgeGenderWiseDeceasedPopulation: wardAgeGenderWiseDeceasedPopulationRouter,
  wardWiseDeathCause: wardWiseDeathCauseRouter,
});
