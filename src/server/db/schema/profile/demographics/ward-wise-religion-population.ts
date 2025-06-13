import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define religion type enum based on the provided religion values
export const religionTypeEnum = pgEnum("religion_type", [
  "HINDU",
  "BUDDHIST",
  "KIRANT",
  "CHRISTIAN",
  "ISLAM",
  "NATURE",
  "BON",
  "JAIN",
  "BAHAI",
  "SIKH",
  "OTHER",
]);

// Define gender type enum for demographic data
export const genderTypeEnum = pgEnum("gender_type", [
  "MALE",      // पुरुष
  "FEMALE",    // महिला
  "TOTAL",     // जम्मा
  "PERCENTAGE" // प्रतिशत
]);

export const religionPopulation = pgTable(
  "religion_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Religion type
    religionType: religionTypeEnum("religion_type").notNull().unique(),

    // Population data by gender
    malePopulation: integer("male_population").notNull().default(0),
    femalePopulation: integer("female_population").notNull().default(0),
    totalPopulation: integer("total_population").notNull().default(0),
    percentage: integer("percentage").default(0), // Store as integer (percentage * 100 for precision)

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type ReligionPopulation = typeof religionPopulation.$inferSelect;
export type NewReligionPopulation = typeof religionPopulation.$inferInsert;

// Legacy exports for backward compatibility
export const wardWiseReligionPopulation = religionPopulation;
export const genderWiseReligionPopulation = religionPopulation;
export type WardWiseReligionPopulation = ReligionPopulation;
export type NewWardWiseReligionPopulation = NewReligionPopulation;
export type GenderWiseReligionPopulation = ReligionPopulation;
export type NewGenderWiseReligionPopulation = NewReligionPopulation;
