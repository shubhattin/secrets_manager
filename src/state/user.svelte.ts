import type { z } from 'zod';
import { ID_TOKEN_INFO_SCHEMA } from '~/tools/auth_tools';

export let user_info = $state<{ value?: z.infer<typeof ID_TOKEN_INFO_SCHEMA> }>({
  value: undefined
});
