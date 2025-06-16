import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define literacy type enum
export const literacyTypeEnum = pgEnum("literacy_type", [
  "BOTH_READING_AND_WRITING",
  "READING_ONLY",
  "ILLITERATE",
  "NOT_MENTIONED",
]);

// Define gender enum
export const genderEnum = pgEnum("gender", [
  "MALE",
  "FEMALE",
  "TOTAL",
]);

export const wardWiseLiteracyStatus = pgTable("ward_wise_literacy_status", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Gender
  gender: genderEnum("gender").notNull(),

  // Literacy status
  literacyType: literacyTypeEnum("literacy_type").notNull(),

  // Number of people with this literacy status in the ward
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseLiteracyStatus = typeof wardWiseLiteracyStatus.$inferSelect;
export type NewWardWiseLiteracyStatus =
  typeof wardWiseLiteracyStatus.$inferInsert;
