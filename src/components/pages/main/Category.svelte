<script lang="ts">
  import { AiOutlineDelete, AiOutlineEdit } from 'svelte-icons-pack/ai';
  import {
    selected_category_id,
    categories_q,
    CATEGORY_QUERY_KEY,
    text_editing_status,
    items_q
  } from './state.svelte';
  import Icon from '~/tools/Icon.svelte';
  import { TiArrowBackOutline } from 'svelte-icons-pack/ti';
  import { client_q } from '~/api/client';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { BiSave } from 'svelte-icons-pack/bi';
  import { RiSystemCloseLargeFill } from 'svelte-icons-pack/ri';
  import { fade, scale, slide } from 'svelte/transition';
  import Item from './Item.svelte';

  const modalStore = getModalStore();
  const query_client = useQueryClient();

  let cateogory = $derived($categories_q.data!.filter((c) => c.id === $selected_category_id)[0]);

  let category_edit_status = $state(false);
  let new_category_description = $state('');
  let new_category_description_element = $state<HTMLInputElement>();

  $effect(() => {
    if (category_edit_status) new_category_description = cateogory.description;
  });
  $effect(() => {
    $text_editing_status = category_edit_status;
  });

  const delete_category_mut = client_q.data.categories.delete_category.mutation({
    async onSuccess() {
      query_client.setQueryData(
        CATEGORY_QUERY_KEY,
        $categories_q.data!.filter((c) => c.id !== cateogory.id)
      );
      $selected_category_id = null;
    }
  });
  const delete_category_func = async () => {
    modalStore.trigger({
      type: 'confirm',
      title: 'Please Confirm',
      body: 'Are you sure you delete this Cateogory ?',
      response: (resp: boolean) =>
        resp &&
        $delete_category_mut.mutate({
          category_id: cateogory.id
        })
    });
  };

  const update_category_mut = client_q.data.categories.update_category_info.mutation({
    async onSuccess() {
      query_client.setQueryData(
        CATEGORY_QUERY_KEY,
        $categories_q.data!.map((c) =>
          c.id !== cateogory.id ? c : { ...c, description: new_category_description }
        )
      );
      new_category_description = '';
      category_edit_status = false;
    }
  });
  const update_category_func = () => {
    modalStore.trigger({
      type: 'confirm',
      title: 'Please Confirm',
      body: 'Are you sure you change the Description ?',
      response: (resp: boolean) =>
        resp &&
        $update_category_mut.mutate({
          description: new_category_description,
          category_id: cateogory.id
        })
    });
  };

  function go_back_to_list() {
    $selected_category_id = null;
  }
</script>

<div class="mb-4 flex space-x-7">
  <span class="space-x-2">
    <button class="btn m-0 p-0 outline-none" onclick={go_back_to_list}>
      <Icon src={TiArrowBackOutline} class="-mt-3 text-2xl" />
    </button>
    {#if !category_edit_status}
      <span class="text-2xl font-bold">{cateogory.description}</span>
    {:else}
      <div in:scale out:slide class="inline-block space-x-3">
        <input
          bind:this={new_category_description_element}
          bind:value={new_category_description}
          class="input w-60 rounded-md px-2 py-1"
        />
        <button
          onclick={update_category_func}
          disabled={$update_category_mut.isPending}
          class="btn space-x-1 rounded-lg bg-surface-600 px-2 py-1 font-bold text-white dark:bg-surface-600"
        >
          <Icon src={BiSave} class="-m-1 -mt-1.5 text-2xl" />
        </button>
        <button
          onclick={() => (category_edit_status = false)}
          disabled={$update_category_mut.isPending}
          class="btn rounded-md bg-error-600 px-1 py-1 text-white dark:bg-error-500"
        >
          <Icon src={RiSystemCloseLargeFill} class="-mt-1 text-xl" />
        </button>
      </div>
    {/if}
  </span>
  {#if !category_edit_status}
    <span class="space-x-3 outline-none" in:fade>
      <button
        onclick={() => {
          category_edit_status = true;
          setTimeout(() => {
            new_category_description_element && new_category_description_element.focus();
          }, 400 + 50);
        }}
        disabled={$delete_category_mut.isPending}
        class="btn rounded-md bg-warning-700 px-2 py-1"
      >
        <Icon src={AiOutlineEdit} class="-ml-1 -mr-1 -mt-1 text-2xl text-white" />
      </button>
      <button
        onclick={delete_category_func}
        disabled={$delete_category_mut.isPending}
        class="btn rounded-md bg-error-600 px-2 py-1"
      >
        <Icon src={AiOutlineDelete} class="-ml-1 -mr-1 -mt-1 text-2xl text-white" />
      </button>
    </span>
  {/if}
</div>
{#if !$items_q.isFetching && $items_q.isSuccess}
  Add
  {#if $items_q.data!.length !== 0}
    <div class="space-y-4">
      {#each $items_q.data as item (item.id)}
        <Item {item} />
      {/each}
    </div>
  {/if}
{:else}
  <div class="space-y-4">
    {#each Array.from({ length: 2 }) as _}
      <div class="space-y-1.5">
        <div class="placeholder h-8 w-2/5 animate-pulse rounded-md"></div>
        <div class="placeholder h-28 w-4/5 animate-pulse rounded-md"></div>
      </div>
    {/each}
  </div>
{/if}
