import { t } from './trpc_init';
import { auth_router } from './routers/auth';
import { data_router } from './routers/data/index';

export const router = t.router({
  auth: auth_router,
  data: data_router
});

export type Router = typeof router;
