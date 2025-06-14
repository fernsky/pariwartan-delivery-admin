import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";

export const familyMainOccupation = pgTable("family_main_occupation", {
  id: uuid("id").defaultRandom().primaryKey(),
  occupation: text("occupation").notNull().unique(),
  age15_19: integer("age_15_19").notNull().default(0),
  age20_24: integer("age_20_24").notNull().default(0),
  age25_29: integer("age_25_29").notNull().default(0),
  age30_34: integer("age_30_34").notNull().default(0),
  age35_39: integer("age_35_39").notNull().default(0),
  age40_44: integer("age_40_44").notNull().default(0),
  age45_49: integer("age_45_49").notNull().default(0),
  totalPopulation: integer("total_population").notNull().default(0),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FamilyMainOccupation = typeof familyMainOccupation.$inferSelect;
export type NewFamilyMainOccupation = typeof familyMainOccupation.$inferInsert;

