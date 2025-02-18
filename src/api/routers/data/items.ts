import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { protectedProcedure, t } from '~/api/trpc_init';
import { db } from '~/db/db';
import { items } from '~/db/schema';
import { ItemsSchemaZod } from '~/db/schema_zod';
import { delay } from '~/tools/delay';

async function verify_category_user(user_id: string, category_id: number) {
  // verifying if the current category belongs to the actaul user
  const category_user = await db.query.categories.findFirst({
    columns: {
      user_id: true
    },
    where: (tbl, { eq }) => eq(tbl.id, category_id)
  });
  return category_user && category_user.user_id === user_id;
}

const get_items_route = protectedProcedure
  .input(
    z.object({
      category_id: z.number().int()
    })
  )
  .output(ItemsSchemaZod.omit({ category_id: true }).array())
  .query(async ({ ctx: { user }, input: { category_id } }) => {
    await delay(600);

    if (!(await verify_category_user(user.id, category_id))) return [];

    const data = await db.query.items.findMany({
      columns: {
        id: true,
        description_encrypted: true,
        text_encrypted: true
      },
      orderBy: ({ id }, { asc }) => [asc(id)],
      where: (tbl, { eq }) => eq(tbl.category_id, category_id)
    });
    return data;
  });

const add_item_route = protectedProcedure
  .input(ItemsSchemaZod.omit({ id: true }))
  .mutation(
    async ({ ctx: { user }, input: { category_id, description_encrypted, text_encrypted } }) => {
      await delay(500);
      if (!(await verify_category_user(user.id, category_id))) return;

      const inserted = await db
        .insert(items)
        .values({
          category_id,
          description_encrypted,
          text_encrypted
        })
        .returning();
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

    await db.delete(items).where(and(eq(items.id, item_id), eq(items.category_id, category_id)));
  });

const update_item_route = protectedProcedure
  .input(ItemsSchemaZod)
  .mutation(async ({ ctx: { user }, input }) => {
    await delay(500);
    if (!(await verify_category_user(user.id, input.category_id))) return;

    // we have to make sure that the item_id -> category_id -> user_id

    await db
      .update(items)
      .set(input)
      .where(and(eq(items.id, input.id), eq(items.category_id, input.category_id)));

    return input;
  });

export const items_router = t.router({
  get_items: get_items_route,
  add_item: add_item_route,
  delete_item: delete_item_route,
  update_item: update_item_route
});
