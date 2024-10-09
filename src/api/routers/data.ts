import { desc, eq } from 'drizzle-orm';
import { protectedProcedure, t } from '~/api/trpc_init';
import { db } from '~/db/db';
import { categories, users } from '~/db/schema';

const get_user_categories_route = protectedProcedure.query(async ({ ctx: { user } }) => {
  const data = db.query.categories.findMany({
    where: ({ user_id }, { eq }) => eq(user_id, user.id)
  });
  return data;
});

export const data_router = t.router({
  get_user_categories: get_user_categories_route
});
