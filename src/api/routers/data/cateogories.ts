import { desc } from 'drizzle-orm';
import { z } from 'zod';
import { protectedProcedure, t } from '~/api/trpc_init';
import { db } from '~/db/db';
import { categories } from '~/db/schema';

const get_user_categories_route = protectedProcedure.query(async ({ ctx: { user } }) => {
  const data = db.query.categories.findMany({
    columns: {
      id: true,
      description: true
    },
    where: ({ user_id }, { eq }) => eq(user_id, user.id)
  });
  return data;
});

const add_category_route = protectedProcedure
  .input(z.object({ description: z.string().min(3).max(60) }))
  .mutation(async ({ ctx: { user }, input: { description } }) => {
    await db.insert(categories).values({ user_id: user.id, description });
  });

export const categories_router = t.router({
  get_user_categories: get_user_categories_route,
  add_category: add_category_route
});
