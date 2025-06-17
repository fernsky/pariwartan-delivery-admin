import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const wardWiseFormalEducation = pgTable('ward_wise_formal_education', {
  id: serial('id').primaryKey(),
  ward: varchar('ward', { length: 10 }).notNull(),
  gender: varchar('gender', { length: 20 }).notNull(),
  total: integer('total').notNull().default(0),
  notMentioned: integer('not_mentioned').notNull().default(0),
  currentlyAttending: integer('currently_attending').notNull().default(0),
  previouslyAttended: integer('previously_attended').notNull().default(0),
  neverAttended: integer('never_attended').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type WardWiseFormalEducation = typeof wardWiseFormalEducation.$inferSelect;
export type NewWardWiseFormalEducation = typeof wardWiseFormalEducation.$inferInsert;
