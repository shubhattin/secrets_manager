import { pgTable, serial, varchar, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  username: varchar('username', { length: 25 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 96 }).notNull()  // bcrypt hash
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  description: text('description').notNull()
});

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  description_encrypted: text('description_encrypted').notNull(),
  text_encrypted: text('text_encrypted').notNull().default('')
});

// relations

export const userRelation = relations(users, ({ many }) => ({
  categories: many(categories)
}));

export const categoryRelation = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.user_id], references: [users.id] }),
  items: many(items)
}));

export const itemRelation = relations(items, ({ one }) => ({
  category: one(categories, { fields: [items.category_id], references: [categories.id] })
}));
