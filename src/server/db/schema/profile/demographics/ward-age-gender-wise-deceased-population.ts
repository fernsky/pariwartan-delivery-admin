import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define the age gender wise deceased population table (without ward breakdown)
export const ageGenderWiseDeceasedPopulation = pgTable(
  "age_gender_wise_deceased_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    ageGroup: varchar("age_group")
      .notNull()
      .$type<
        | "AGE_1_YEAR"
        | "AGE_1_4_YEARS"
        | "AGE_5_9_YEARS"
        | "AGE_10_14_YEARS"
        | "AGE_15_19_YEARS"
        | "AGE_20_24_YEARS"
        | "AGE_25_29_YEARS"
        | "AGE_30_34_YEARS"
        | "AGE_35_39_YEARS"
        | "AGE_40_44_YEARS"
        | "AGE_45_49_YEARS"
        | "AGE_50_54_YEARS"
        | "AGE_55_59_YEARS"
        | "AGE_60_64_YEARS"
        | "AGE_65_69_YEARS"
        | "AGE_70_74_YEARS"
        | "AGE_75_79_YEARS"
        | "AGE_80_AND_ABOVE"
      >(),
    gender: varchar("gender").notNull().$type<"MALE" | "FEMALE" | "OTHER">(),
    deceasedPopulation: integer("deceased_population").notNull().default(0),
    updatedAt: timestamp("updated_at")
      .default(sql`NOW()`)
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").default(sql`NOW()`),
  }
);

export type AgeGenderWiseDeceasedPopulation =
  typeof ageGenderWiseDeceasedPopulation.$inferSelect;
export type NewAgeGenderWiseDeceasedPopulation =
  typeof ageGenderWiseDeceasedPopulation.$inferInsert;
