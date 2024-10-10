import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { protectedProcedure, t } from '~/api/trpc_init';
import { db } from '~/db/db';
import { categories } from '~/db/schema';
import { delay } from '~/tools/delay';

const get_user_categories_route = protectedProcedure.query(async ({ ctx: { user } }) => {
  await delay(300);
  const data = db.query.categories.findMany({
    columns: {
      id: true,
      description: true
    },
    orderBy: ({ description, id }, { asc }) => [asc(description), asc(id)],
    where: ({ user_id }, { eq }) => eq(user_id, user.id)
  });
  return data;
});

const add_category_route = protectedProcedure
  .input(z.object({ description: z.string().min(3).max(60) }))
  .mutation(async ({ ctx: { user }, input: { description } }) => {
    await delay(600);
    const inserted = await db
      .insert(categories)
      .values({ user_id: user.id, description })
      .returning();
    return inserted[0];
  });

const delete_category_route = protectedProcedure
  .input(z.object({ category_id: z.number() }))
  .mutation(async ({ ctx: { user }, input: { category_id } }) => {
    await delay(600);
    await db
      .delete(categories)
      .where(and(eq(categories.id, category_id), eq(categories.user_id, user.id)));
  });

export const categories_router = t.router({
  get_user_categories: get_user_categories_route,
  add_category: add_category_route,
  delete_category: delete_category_route
});
