import { browser } from '$app/environment';
import { createQuery } from '@tanstack/svelte-query';
import { writable } from 'svelte/store';
import { client } from '~/api/client';
import { queryClient } from '~/state/queryClient';
import { user_info } from '~/state/user.svelte';
import { get_derived_query } from '~/tools/query';

export let text_editing_status = writable(false);
export let selected_category_id = writable<number | null>(null);

export const CATEGORY_QUERY_KEY = ['categories'];
export const get_item_query_key = (category_id: number) => ['categories', category_id];

export const categories_q = get_derived_query(
  [user_info, text_editing_status],
  ([$user_info, $text_editing_status]) => {
    // console.log([$user_info, $text_editing_status]);
    // this actually does not depends on user_info after logout it will automatically go into inactive state
    return createQuery(
      {
        queryKey: ['categories'],
        enabled: browser && !!$user_info,
        queryFn: async () => {
          const data = await client.data.categories.get_user_categories.query();
          return data;
        },
        ...($text_editing_status
          ? {
              staleTime: Infinity
              // while editing the data should not go stale, else it would refetch lead to data loss
            }
          : {})
      },
      queryClient
    );
  }
);

export const items_q = get_derived_query(
  [user_info, text_editing_status, selected_category_id],
  ([$user_info, $text_editing_status, $selected_category_id]) => {
    // console.log($user_info, $text_editing_status, $selected_category_id);
    return createQuery(
      {
        queryKey: get_item_query_key($selected_category_id!),
        enabled: browser && !!$user_info && !!$selected_category_id,
        queryFn: async () => {
          const data = await client.data.items.get_items.query({
            category_id: $selected_category_id!
          });
          return data;
        },
        ...($text_editing_status
          ? {
              staleTime: Infinity
              // while editing the data should not go stale, else it would refetch lead to data loss
            }
          : {})
      },
      queryClient
    );
  }
);
