import { t } from './trpc_init';
import { data_router } from './routers/data/index';

export const router = t.router({
  data: data_router
});

export type Router = typeof router;
