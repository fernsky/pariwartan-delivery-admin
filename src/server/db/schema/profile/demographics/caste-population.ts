import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { CasteType, casteTypeValues } from "../../common/enums";

export const castePopulation = pgTable("caste_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Caste or ethnic group - using the enum values
  casteType: varchar("caste_type", { length: 100 })
    .$type<CasteType>()
    .notNull(),

  // Male population count for this caste
  malePopulation: integer("male_population").notNull().default(0),

  // Female population count for this caste
  femalePopulation: integer("female_population").notNull().default(0),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type CastePopulation = typeof castePopulation.$inferSelect;
export type NewCastePopulation = typeof castePopulation.$inferInsert;
