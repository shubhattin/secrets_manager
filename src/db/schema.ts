import { pgTable, serial, date, varchar, integer, text, char, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  user_id: varchar('user_id', { length: 25 }).notNull().unique(),
  password_hash: char('password_hash', { length: 96 }).notNull() // SHA-256 hash + salt of length 32
});
