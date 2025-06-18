import { pgTable } from "drizzle-orm/pg-core";
import { integer, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const municipalityWardWiseSettlement = pgTable("acme_municipality_ward_wise_settlement", {
  id: varchar("id", { length: 36 }).primaryKey(),
  municipalityId: integer("municipality_id").notNull(),
  wardNumber: integer("ward_number").notNull(),
  wardNumberNepali: varchar("ward_number_nepali", { length: 10 }).notNull(),
  settlementName: varchar("settlement_name", { length: 200 }).notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`NOW()`)
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").default(sql`NOW()`),
});

export type MunicipalityWardWiseSettlement = typeof municipalityWardWiseSettlement.$inferSelect;
export type NewMunicipalityWardWiseSettlement = typeof municipalityWardWiseSettlement.$inferInsert;
