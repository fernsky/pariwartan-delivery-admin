import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const wardGenderWiseEconomicallyActivePopulation = pgTable("acme_ward_gender_wise_economically_active_population", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: varchar("ward_number", { length: 10 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  age10PlusTotal: integer("age_10_plus_total").notNull().default(0),
  economicallyActiveEmployed: integer("economically_active_employed").notNull().default(0),
  economicallyActiveUnemployed: integer("economically_active_unemployed").notNull().default(0),
  householdWork: integer("household_work").notNull().default(0),
  economicallyActiveTotal: integer("economically_active_total").notNull().default(0),
  dependentPopulation: integer("dependent_population").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardGenderWiseEconomicallyActivePopulation = typeof wardGenderWiseEconomicallyActivePopulation.$inferSelect;
export type NewWardGenderWiseEconomicallyActivePopulation = typeof wardGenderWiseEconomicallyActivePopulation.$inferInsert;
