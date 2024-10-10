import { categories_router } from './cateogories';
import { t } from '~/api/trpc_init';

export const data_router = t.router({
  categories: categories_router
});
