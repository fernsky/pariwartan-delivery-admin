import { pgTable } from "../../basic";
import { integer, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

// Define house ownership type enum
export const houseOwnershipTypeEnum = pgEnum("ownership_type_enum", [
  "PRIVATE",
  "RENT",
  "INSTITUTIONAL",
  "OTHER",
]);

export const wardWiseHouseOwnership = pgTable("acme_ward_wise_house_ownership", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of house ownership
  ownershipType: houseOwnershipTypeEnum("ownership_type").notNull(),

  // Number of households with this ownership type
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseHouseOwnership = typeof wardWiseHouseOwnership.$inferSelect;
export type NewWardWiseHouseOwnership =
  typeof wardWiseHouseOwnership.$inferInsert;
