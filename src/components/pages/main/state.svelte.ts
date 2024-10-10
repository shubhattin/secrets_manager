import { browser } from '$app/environment';
import { createQuery } from '@tanstack/svelte-query';
import { toStore } from 'svelte/store';
import { client } from '~/api/client';
import { user_info } from '~/state/user.svelte';
import { get_derived_query } from '~/tools/query';

export const cateogories = get_derived_query([toStore(() => user_info.value)], ([$user_info]) =>
  // this actually does not depends on user_info after logout it will automatically go into inactive state
  createQuery({
    queryKey: ['categories'],
    enabled: browser && !!$user_info,
    queryFn: async () => {
      const data = await client.data.categories.get_user_categories.query();
      return data;
    }
  })
);
