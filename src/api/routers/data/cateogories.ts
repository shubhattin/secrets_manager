import { protectedProcedure, t } from '~/api/trpc_init';
import { db } from '~/db/db';

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

export const categories_router = t.router({
  get_user_categories: get_user_categories_route
});
