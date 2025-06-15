import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define age group enum
export const ageGroupEnum = pgEnum("age_group", [
  "0-14",
  "15-24", 
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65_PLUS",
  "NOT_MENTIONED",
  "TOTAL"
]);

// Define gender enum
export const genderEnum = pgEnum("gender", [
  "MALE",
  "FEMALE", 
  "TOTAL"
]);

// Define country region enum based on the SQL data
export const countryRegionEnum = pgEnum("country_region", [
  "INDIA",
  "SAARC",
  "ASIAN", 
  "MIDDLE_EAST",
  "OTHER_ASIAN",
  "EUROPE",
  "OTHER_EUROPE", 
  "NORTH_AMERICA",
  "AFRICA",
  "PACIFIC",
  "OTHER",
  "NOT_DISCLOSED"
]);

// Keep the same table name to avoid UI changes
export const wardWiseForeignEmploymentCountries = pgTable("ward_wise_foreign_employment_countries", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Demographics - age group and gender based structure
  ageGroup: varchar("age_group", { length: 50 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),

  // Country region
  country: varchar("country", { length: 50 }).notNull(),

  // Population count in that region
  population: integer("population").notNull(),

  // Total for this demographic combination
  total: integer("total").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Keep the same type names for UI compatibility
export type WardWiseForeignEmploymentCountries = typeof wardWiseForeignEmploymentCountries.$inferSelect;
export type NewWardWiseForeignEmploymentCountries = typeof wardWiseForeignEmploymentCountries.$inferInsert;
