<script lang="ts">
  import { CATEGORY_QUERY_KEY, categories_q, selected_category_id } from './state.svelte';
  import { VscAdd } from 'svelte-icons-pack/vsc';
  import { RiSystemCloseLargeFill } from 'svelte-icons-pack/ri';
  import { scale, slide } from 'svelte/transition';
  import Icon from '~/tools/Icon.svelte';
  import { client_q } from '~/api/client';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { AiOutlinePlus } from 'svelte-icons-pack/ai';
  import { LuRefreshCw } from 'svelte-icons-pack/lu';
  import { cl_join } from '~/tools/cl_join';

  const query_client = useQueryClient();

  let add_section_opened = $state(false);

  let new_category_description = $state('');
  let new_category_description_element = $state<HTMLInputElement>();

  const add_new_cateogory_mut = client_q.data.categories.add_category.mutation({
    async onSuccess(new_data) {
      new_category_description = '';
      add_section_opened = false;
      const old_data = $categories_q.data!;
      query_client.setQueryData(CATEGORY_QUERY_KEY, [new_data, ...old_data]);
    }
  });

  const refresh = async () => {
    await $categories_q.refetch();
  };
</script>

<div class="flex space-x-2.5 sm:space-x-4">
  <button
    disabled={add_section_opened || !(!$categories_q.isFetching && $categories_q.isSuccess)}
    onclick={() => {
      add_section_opened = true;
      setTimeout(() => {
        new_category_description_element && new_category_description_element.focus();
      }, 400 + 50);
    }}
    class="btn bg-secondary-700 dark:bg-secondary-700 gap-1 space-x-1 rounded-lg px-2 py-1 font-bold text-white"
  >
    <Icon src={VscAdd} class="text-2xl" />
    <span>Add New Cateogory</span>
  </button>
  <button
    onclick={refresh}
    disabled={$categories_q.isFetched && $categories_q.isFetching}
    class={cl_join(
      'outline-hidden select-none',
      $categories_q.isFetched && $categories_q.isFetching && 'animate-spin'
    )}><Icon src={LuRefreshCw} class="text-2xl" /></button
  >
</div>
{#if add_section_opened}
  {@render add_new_section()}
{/if}
<div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
  {#if !$categories_q.isFetching && $categories_q.isSuccess}
    {#each $categories_q.data as category (category.id)}
      <button
        onclick={() => ($selected_category_id = category.id)}
        class="btn rounded-md border border-amber-600 text-wrap outline-hidden dark:border-yellow-400"
      >
        {category.description}
      </button>
    {/each}
  {:else}
    {#each Array.from({ length: 6 }) as _}
      <div class="placeholder h-10 animate-pulse rounded-md"></div>
    {/each}
  {/if}
</div>

{#snippet add_new_section()}
  <form
    out:slide
    in:scale
    class="mt-2 space-x-2"
    onsubmit={(e) => {
      e.preventDefault();
      $add_new_cateogory_mut.mutateAsync({
        description: new_category_description
      });
    }}
  >
    <input
      type="text"
      min={3}
      max={60}
      required
      bind:this={new_category_description_element}
      bind:value={new_category_description}
      placeholder="Description"
      class="input inline-block w-3/5 rounded-md sm:w-4/5"
    />
    <button
      disabled={$add_new_cateogory_mut.isPending}
      type="submit"
      class="btn bg-primary-700 dark:bg-primary-700 space-x-1 rounded-lg px-2 py-1 font-bold text-white"
    >
      <Icon src={AiOutlinePlus} class="-mx-1 -my-1 text-2xl" />
    </button>
    <button
      disabled={$add_new_cateogory_mut.isPending}
      onclick={() => (add_section_opened = false)}
      class="btn bg-error-600 dark:bg-error-500 rounded-md px-1 py-1 text-white"
    >
      <Icon src={RiSystemCloseLargeFill} class="-mt-1 text-xl" />
    </button>
  </form>
{/snippet}
