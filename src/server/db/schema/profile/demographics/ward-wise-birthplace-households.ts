import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const birthplaceHouseholds = pgTable(
  "birthplace_households",
  {
    id: varchar("id", { length: 36 }).primaryKey(),


    // Age group (e.g., "०-४ वर्ष", "५-९ वर्ष", etc.)
    ageGroup: varchar("age_group", { length: 50 }).notNull(),

    // Population counts by birth place
    totalPopulation: integer("total_population").notNull(),
    nepalBorn: integer("nepal_born").notNull(),
    bornInDistrictMunicipality: integer("born_in_district_municipality").notNull(),
    bornInDistrictOther: integer("born_in_district_other").notNull(),
    bornInDistrictTotal: integer("born_in_district_total").notNull(),
    bornOtherDistrict: integer("born_other_district").notNull(),
    bornAbroad: integer("born_abroad").notNull(),
    birthPlaceUnknown: integer("birth_place_unknown").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type BirthplaceHouseholds = 
  typeof birthplaceHouseholds.$inferSelect;
export type NewBirthplaceHouseholds = 
  typeof birthplaceHouseholds.$inferInsert;