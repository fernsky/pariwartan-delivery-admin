import { relations } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const heroDemographics = pgTable(
  "acme_ward_demographics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    municipalityId: uuid("municipality_id").notNull(),
    wardNo: integer("ward_no").notNull(),
    includedVdcOrMunicipality: text("included_vdc_or_municipality").notNull(),
    population: integer("population").notNull(),
    areaSqKm: decimal("area_sq_km", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    municipalityIdIdx: index("idx_ward_demographics_municipality_id").on(
      table.municipalityId,
    ),
    wardNoIdx: index("idx_ward_demographics_ward_no").on(table.wardNo),
    municipalityWardUnique: unique().on(table.municipalityId, table.wardNo),
  }),
);

export type HeroDemographic = typeof heroDemographics.$inferSelect;
export type InsertHeroDemographic = typeof heroDemographics.$inferInsert;

