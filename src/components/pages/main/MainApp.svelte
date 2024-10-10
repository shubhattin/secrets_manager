<script lang="ts">
  import { browser } from '$app/environment';
  import { createQuery } from '@tanstack/svelte-query';
  import { client } from '~/api/client';
  import { user_info } from '~/state/user.svelte';

  const cateogories = $derived(
    createQuery({
      queryKey: ['categories'],
      enabled: browser && !!user_info.value,
      queryFn: async () => {
        const data = await client.data.categories.get_user_categories.query();
        return data;
      }
    })
  );
</script>

{#if !$cateogories.isFetching && $cateogories.isSuccess}
  {#each $cateogories.data as category (category.id)}
    <div>{category.description}</div>
  {/each}
{/if}
