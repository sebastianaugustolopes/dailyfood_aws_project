import { date, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({length: 255}).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  goal: varchar('goal', { length: 8 }).notNull(),
  gender: varchar('gender', { length: 6 }).notNull(),
  birthDate: date('birth_date').notNull(),
  height: integer('height').notNull(),
  weight: integer('weight').notNull(),
  activityLevel: integer('activity_level').notNull(),

  // Goals
  calories: integer('calories').notNull(),
  proteins: integer('proteins').notNull(),
  carbohydrates: integer('carbohydrates').notNull(),
  fats: integer('fats').notNull(),
});
