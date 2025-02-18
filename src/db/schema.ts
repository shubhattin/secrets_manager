import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
export * from './auth-schema';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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

export const userRelation = relations(user, ({ many }) => ({
  categories: many(categories)
}));

export const categoryRelation = relations(categories, ({ one, many }) => ({
  user: one(user, { fields: [categories.user_id], references: [user.id] }),
  items: many(items)
}));

export const itemRelation = relations(items, ({ one }) => ({
  category: one(categories, { fields: [items.category_id], references: [categories.id] })
}));
