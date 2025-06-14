import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const disabilityByAge = pgTable(
  "disability_by_age",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Age group
    ageGroup: varchar("age_group", { length: 50 }).notNull(),

    // Different disability types
    physicalDisability: integer("physical_disability").notNull(),
    visualImpairment: integer("visual_impairment").notNull(),
    hearingImpairment: integer("hearing_impairment").notNull(),
    deafMute: integer("deaf_mute").notNull(),
    speechHearingCombined: integer("speech_hearing_combined").notNull(),
    intellectualDisability: integer("intellectual_disability").notNull(),
    mentalPsychosocial: integer("mental_psychosocial").notNull(),
    autism: integer("autism").notNull(),
    multipleDisabilities: integer("multiple_disabilities").notNull(),
    otherDisabilities: integer("other_disabilities").notNull(),
    total: integer("total").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type DisabilityByAge = typeof disabilityByAge.$inferSelect;
export type NewDisabilityByAge = typeof disabilityByAge.$inferInsert;
