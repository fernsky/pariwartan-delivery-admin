import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";

export const wardWiseAgricultureFirmCount = pgTable("ward_wise_agriculture_firm_count", {
  id: uuid("id").primaryKey().defaultRandom(),
  wardNumber: integer("ward_number").notNull(),
  count: integer("count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
