import { pgTable } from "drizzle-orm/pg-core";
import { decimal, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const municipalityAspect = pgTable("acme_municipality_aspect", {
  id: varchar("id", { length: 36 }).primaryKey(),
  municipalityId: integer("municipality_id").notNull(),
  directionNepali: varchar("direction_nepali", { length: 100 }).notNull(),
  directionEnglish: varchar("direction_english", { length: 100 }).notNull(),
  areaSqKm: decimal("area_sq_km", { precision: 8, scale: 2 }).notNull(),
  areaPercentage: decimal("area_percentage", { precision: 5, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`NOW()`)
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").default(sql`NOW()`),
});

export type MunicipalityAspect = typeof municipalityAspect.$inferSelect;
export type NewMunicipalityAspect = typeof municipalityAspect.$inferInsert;
