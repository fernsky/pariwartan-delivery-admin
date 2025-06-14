import { pgTable } from "../../../schema/basic";
import { integer, varchar } from "drizzle-orm/pg-core";

// Define the age group house head table (matches SQL table name)
export const ageGroupHousehead = pgTable("age_group_househead", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Age group information
  ageGroup: varchar("age_group", { length: 50 }).notNull().unique(),

  // Count of male household heads
  maleHeads: integer("male_heads").notNull().default(0),

  // Count of female household heads
  femaleHeads: integer("female_heads").notNull().default(0),

  // Total number of families in this age group
  totalFamilies: integer("total_families").notNull().default(0),
});

export type AgeGroupHousehead = typeof ageGroupHousehead.$inferSelect;
export type NewAgeGroupHousehead = typeof ageGroupHousehead.$inferInsert;
