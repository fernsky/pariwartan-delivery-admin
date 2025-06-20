import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define facility type enum
export const facilityTypeEnum = pgEnum("facility_type", [
  "RADIO",
  "TELEVISION",
  "COMPUTER",
  "INTERNET",
  "MOBILE_PHONE",
  "CAR_JEEP",
  "MOTORCYCLE",
  "BICYCLE",
  "REFRIGERATOR",
  "WASHING_MACHINE",
  "AIR_CONDITIONER",
  "ELECTRICAL_FAN",
  "MICROWAVE_OVEN",
  "DAILY_NATIONAL_NEWSPAPER_ACCESS",
  "NONE",
]);

export const municipalityFacilities = pgTable("municipality_facilities", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Type of household facility
  facility: facilityTypeEnum("facility").notNull(),

  // Population with this facility
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MunicipalityFacilities = typeof municipalityFacilities.$inferSelect;
export type NewMunicipalityFacilities = typeof municipalityFacilities.$inferInsert;
