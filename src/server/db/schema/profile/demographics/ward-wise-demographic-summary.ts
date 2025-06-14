import { pgTable } from "../../../schema/basic";
import {
  integer,
  decimal,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const demographicSummary = pgTable("demographic_summary", {
  id: varchar("id", { length: 36 }).primaryKey().default("singleton"),

  // Basic population statistics
  totalPopulation: integer("total_population"),
  populationMale: integer("population_male"),
  populationFemale: integer("population_female"),

  // Demographic ratios and rates
  sexRatio: decimal("sex_ratio"), // Males per 100 females
  annualGrowthRate: decimal("annual_growth_rate"), // Annual population growth rate
  literacyRate: decimal("literacy_rate"), // Literacy rate for 5+ years

  // Household data
  totalHouseholds: integer("total_households"),
  averageHouseholdSize: decimal("average_household_size"),

  // Geographic data
  populationDensity: decimal("population_density"), // Per sq km

  // Data year information
  dataYear: text("data_year"), // BS year like "२०६१"
  dataYearEnglish: text("data_year_english"), // English year like "2061 BS (2004-2005 AD)"

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DemographicSummary = typeof demographicSummary.$inferSelect;
export type NewDemographicSummary = typeof demographicSummary.$inferInsert;

// Legacy exports for backward compatibility
export const wardWiseDemographicSummary = demographicSummary;
export type WardWiseDemographicSummary = DemographicSummary;
export type NewWardWiseDemographicSummary = NewDemographicSummary;
