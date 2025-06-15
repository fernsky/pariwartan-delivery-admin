import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define outer wall type enum
export const outerWallTypeEnum = pgEnum("outer_wall_type", [
  "MUD_JOINED_BRICK_STONE", // माटोको जोडाइ भएको ईंटा/ढुंगा
  "CEMENT_BRICK_JOINED", // सिमेन्ट र इट्टाको जोडाइ भएको
  "WOOD", // काठ
  "BAMBOO", // बांस
  "UNBAKED_BRICK", // कांचो ईंटा
  "TIN", // जस्तापाता
  "OTHER", // अन्य
]);

export const wardWiseHouseholdOuterWall = pgTable(
  "ward_wise_household_outer_wall",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Type of house outer wall
    wallType: outerWallTypeEnum("wall_type").notNull(),

    // Number of households with this wall type
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseHouseholdOuterWall =
  typeof wardWiseHouseholdOuterWall.$inferSelect;
export type NewWardWiseHouseholdOuterWall =
  typeof wardWiseHouseholdOuterWall.$inferInsert;
  typeof wardWiseHouseholdOuterWall.$inferInsert;
