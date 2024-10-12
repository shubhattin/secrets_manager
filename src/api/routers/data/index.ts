import { categories_router } from './cateogories';
import { t } from '~/api/trpc_init';
import { items_router } from './items';

export const data_router = t.router({
  categories: categories_router,
  items: items_router
});
