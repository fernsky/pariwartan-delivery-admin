import { pgTable, uuid, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const municipalityWideVeterinaryRepresentatives = pgTable("municipality_wide_veterinery_representatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  serialNumber: integer("serial_number").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  nameEnglish: varchar("name_english", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  positionEnglish: varchar("position_english", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 20 }).notNull(),
  branch: varchar("branch", { length: 100 }).notNull(),
  branchEnglish: varchar("branch_english", { length: 100 }).notNull(),
  remarks: text("remarks").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
