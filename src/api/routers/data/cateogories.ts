import { eq, and } from 'drizzle-orm';
import ms from 'ms';
import { z } from 'zod';
import { protectedProcedure, t } from '~/api/trpc_init';
import { db, redis } from '~/db/db';
import { categories } from '~/db/schema';
import { delay } from '~/tools/delay';

const get_user_categories_route = protectedProcedure.query(async ({ ctx: { user } }) => {
  const cache = await redis.get(`user:${user.id}:categories`);
  if (cache)
    return cache as {
      id: number;
      description: string;
    }[];

  await delay(300);
  const data = await db.query.categories.findMany({
    columns: {
      id: true,
      description: true
    },
    orderBy: ({ description, id }, { asc }) => [asc(description), asc(id)],
    where: ({ user_id }, { eq }) => eq(user_id, user.id)
  });
  await redis.set(`user:${user.id}:categories`, data, { ex: ms('10days') / 1000 });
  return data;
});

const add_category_route = protectedProcedure
  .input(z.object({ description: z.string().min(3).max(60) }))
  .mutation(async ({ ctx: { user }, input: { description } }) => {
    await delay(600);
    const inserted_pr = db.insert(categories).values({ user_id: user.id, description }).returning();
    const [inserted] = await Promise.all([inserted_pr, redis.del(`user:${user.id}:categories`)]);
    return inserted[0];
  });

const delete_category_route = protectedProcedure
  .input(z.object({ category_id: z.number().int() }))
  .mutation(async ({ ctx: { user }, input: { category_id } }) => {
    await delay(600);
    await Promise.allSettled([
      db
        .delete(categories)
        .where(and(eq(categories.id, category_id), eq(categories.user_id, user.id))),
      redis.del(`user:${user.id}:categories`),
      redis.del(`category:${category_id}:user:${user.id}`),
      redis.del(`category:${category_id}:items`)
    ]);
  });

const update_category_info_route = protectedProcedure
  .input(z.object({ category_id: z.number().int(), description: z.string().min(3).max(60) }))
  .mutation(async ({ ctx: { user }, input: { category_id, description } }) => {
    await delay(600);
    await Promise.allSettled([
      db
        .update(categories)
        .set({ description })
        .where(and(eq(categories.id, category_id), eq(categories.user_id, user.id))),
      redis.del(`user:${user.id}:categories`)
    ]);
  });

export const categories_router = t.router({
  get_user_categories: get_user_categories_route,
  add_category: add_category_route,
  delete_category: delete_category_route,
  update_category_info: update_category_info_route
});
