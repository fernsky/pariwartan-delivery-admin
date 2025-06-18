import { pgTable } from "drizzle-orm/pg-core";
import { integer, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const municipalitySlope = pgTable("acme_municipality_slope", {
  id: varchar("id", { length: 36 }).primaryKey(),
  municipalityId: integer("municipality_id").notNull(),
  slopeRangeNepali: varchar("slope_range_nepali", { length: 100 }).notNull(),
  slopeRangeEnglish: varchar("slope_range_english", { length: 100 }).notNull(),
  areaSqKm: decimal("area_sq_km", { precision: 8, scale: 2 }).notNull(),
  areaPercentage: decimal("area_percentage", { precision: 5, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`NOW()`)
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").default(sql`NOW()`),
});

export type MunicipalitySlope = typeof municipalitySlope.$inferSelect;
export type NewMunicipalitySlope = typeof municipalitySlope.$inferInsert;
