import { users, categories, items } from './schema';
import { createSelectSchema } from 'drizzle-zod';

export const UsersSchemaZod = createSelectSchema(users);
export const CategoriesSchemaZod = createSelectSchema(categories);
export const ItemsSchemaZod = createSelectSchema(items);
