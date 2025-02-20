import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { protectedProcedure, t } from '~/api/trpc_init';
import { db, redis } from '~/db/db';
import { items } from '~/db/schema';
import { ItemsSchemaZod } from '~/db/schema_zod';
import { delay } from '~/tools/delay';
import ms from 'ms';

async function verify_category_user(user_id: string, category_id: number) {
  // verifying if the current category belongs to the actaul user
  const cache = (await redis.get(`category:${category_id}:user:${user_id}`)) as boolean;
  if (cache) return cache;
  const category_user = await db.query.categories.findFirst({
    columns: {
      user_id: true
    },
    where: (tbl, { eq }) => eq(tbl.id, category_id)
  });
  const category_user_verified = category_user ? category_user.user_id === user_id : false;
  await redis.set(`category:${category_id}:user:${user_id}`, category_user_verified, {
    ex: ms('15days') / 1000
  });
  return category_user_verified;
}

const get_items_route = protectedProcedure
  .input(
    z.object({
      category_id: z.number().int()
    })
  )
  .output(ItemsSchemaZod.omit({ category_id: true }).array())
  .query(async ({ ctx: { user }, input: { category_id } }) => {
    if (!(await verify_category_user(user.id, category_id))) return [];

    const cache = await redis.get(`category:${category_id}:items`);
    if (cache)
      return cache as { id: number; description_encrypted: string; text_encrypted: string }[];

    await delay(600);
    const data = await db.query.items.findMany({
      columns: {
        id: true,
        description_encrypted: true,
        text_encrypted: true
      },
      orderBy: ({ id }, { asc }) => [asc(id)],
      where: (tbl, { eq }) => eq(tbl.category_id, category_id)
    });
    await redis.set(`category:${category_id}:items`, data, { ex: ms('10days') / 1000 });
    return data;
  });

const add_item_route = protectedProcedure
  .input(ItemsSchemaZod.omit({ id: true }))
  .mutation(
    async ({ ctx: { user }, input: { category_id, description_encrypted, text_encrypted } }) => {
      await delay(500);
      if (!(await verify_category_user(user.id, category_id))) return;

      const inserted_pr = db
        .insert(items)
        .values({
          category_id,
          description_encrypted,
          text_encrypted
        })
        .returning();
      const [inserted] = await Promise.all([
        inserted_pr,
        redis.del(`category:${category_id}:items`)
      ]);
      return inserted[0];
    }
  );

const delete_item_route = protectedProcedure
  .input(
    z.object({
      category_id: z.number().int(),
      item_id: z.number().int()
    })
  )
  .mutation(async ({ ctx: { user }, input: { category_id, item_id } }) => {
    await delay(500);
    if (!(await verify_category_user(user.id, category_id))) return;

    // we have to make sure that the item_id -> category_id -> user_id

    await Promise.allSettled([
      db.delete(items).where(and(eq(items.id, item_id), eq(items.category_id, category_id))),
      redis.del(`category:${category_id}:items`)
    ]);
  });

const update_item_route = protectedProcedure
  .input(ItemsSchemaZod)
  .mutation(async ({ ctx: { user }, input }) => {
    await delay(500);
    if (!(await verify_category_user(user.id, input.category_id))) return;

    // we have to make sure that the item_id -> category_id -> user_id

    await Promise.allSettled([
      db
        .update(items)
        .set(input)
        .where(and(eq(items.id, input.id), eq(items.category_id, input.category_id))),
      redis.del(`category:${input.category_id}:items`)
    ]);

    return input;
  });

export const items_router = t.router({
  get_items: get_items_route,
  add_item: add_item_route,
  delete_item: delete_item_route,
  update_item: update_item_route
});
