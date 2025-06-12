import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseBirthCertificatePopulation = pgTable(
  "ward_wise_birth_certificate_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity
    wardNumber: integer("ward_number").notNull(),

    // Children with birth certificates under 5 years in this ward
    withBirthCertificate: integer("with_birth_certificate").notNull(),

    // Children without birth certificates under 5 years in this ward
    withoutBirthCertificate: integer("without_birth_certificate").notNull(),

    // Total population under 5 years (auto-calculated)
    totalPopulationUnder5: integer("total_population_under_5"),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseBirthCertificatePopulation = 
  typeof wardWiseBirthCertificatePopulation.$inferSelect;
export type NewWardWiseBirthCertificatePopulation = 
  typeof wardWiseBirthCertificatePopulation.$inferInsert;
