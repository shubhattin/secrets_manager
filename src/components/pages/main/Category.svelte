<script lang="ts">
  import { AiOutlineDelete, AiOutlineEdit } from 'svelte-icons-pack/ai';
  import {
    selected_category_id,
    categories_q,
    CATEGORY_QUERY_KEY,
    text_editing_status,
    get_item_query_key
  } from './state.svelte';
  import Icon from '~/tools/Icon.svelte';
  import { TiArrowBackOutline } from 'svelte-icons-pack/ti';
  import { client_q } from '~/api/client';
  import { useIsFetching, useQueryClient } from '@tanstack/svelte-query';
  import { BiSave } from 'svelte-icons-pack/bi';
  import { RiSystemCloseLargeFill, RiSystemRefreshLine } from 'svelte-icons-pack/ri';
  import { fade, scale, slide } from 'svelte/transition';
  import Items from './ItemList.svelte';
  import ConfirmPopover from '~/components/PopoverModals/ConfirmPopover.svelte';
  import { cl_join } from '~/tools/cl_join';

  const query_client = useQueryClient();

  let cateogory = $derived($categories_q.data!.filter((c) => c.id === $selected_category_id)[0]);

  let category_edit_status = $state(false);
  let new_category_description = $state('');
  let new_category_description_element = $state<HTMLInputElement>();

  let delete_popup_status = $state(false);
  let update_popup_status = $state(false);

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

  function go_back_to_list() {
    $selected_category_id = null;
  }

  const refresh = async () => {
    query_client.invalidateQueries({
      queryKey: get_item_query_key($selected_category_id!),
      exact: true
    });
  };

  let is_fetching = useIsFetching({
    queryKey: get_item_query_key($selected_category_id!),
    exact: true
  });
</script>

<div class="mb-4 flex space-x-7">
  <span class="space-x-2">
    <button class="btn m-0 gap-0 p-0 outline-hidden" onclick={go_back_to_list}>
      <Icon src={TiArrowBackOutline} class="-mt-3 text-2xl" />
    </button>
    {#if !category_edit_status}
      <span class="text-2xl font-bold">{cateogory.description}</span>
    {:else}
      <div in:scale out:slide class="inline-block space-x-3">
        <input
          bind:this={new_category_description_element}
          bind:value={new_category_description}
          class="input inline-block w-60 rounded-md px-2 py-1"
        />
        <ConfirmPopover
          bind:popup_state={update_popup_status}
          description="Are you sure to change the Description ?"
          cancel_func={() => (update_popup_status = false)}
          confirm_func={() => {
            $update_category_mut.mutate({
              description: new_category_description,
              category_id: cateogory.id
            });
            update_popup_status = false;
          }}
          placement="bottom"
        >
          <button
            disabled={$update_category_mut.isPending}
            class="btn bg-surface-600 dark:bg-surface-600 space-x-1 rounded-lg px-2 py-1 font-bold text-white"
          >
            <Icon src={BiSave} class="-m-1 -mt-1.5 text-2xl" />
          </button>
        </ConfirmPopover>
        <button
          onclick={() => (category_edit_status = false)}
          disabled={$update_category_mut.isPending}
          class="btn bg-error-600 dark:bg-error-500 rounded-md px-1 py-1 text-white"
        >
          <Icon src={RiSystemCloseLargeFill} class="-mt-1 text-xl" />
        </button>
      </div>
    {/if}
  </span>
  {#if !category_edit_status}
    <span class="space-x-3 outline-hidden" in:fade>
      <button
        onclick={() => {
          category_edit_status = true;
          new_category_description = cateogory.description;
          setTimeout(() => {
            new_category_description_element && new_category_description_element.focus();
          }, 400 + 50);
        }}
        disabled={$text_editing_status || $delete_category_mut.isPending}
        class="btn bg-warning-700 rounded-md px-2 py-1"
      >
        <Icon src={AiOutlineEdit} class="-mt-1 -mr-1 -ml-1 text-2xl text-white" />
      </button>
      <ConfirmPopover
        bind:popup_state={delete_popup_status}
        description="Are you sure to delete this Category ?"
        cancel_func={() => (delete_popup_status = false)}
        confirm_func={() => {
          $delete_category_mut.mutate({
            category_id: cateogory.id
          });
          delete_popup_status = false;
        }}
        placement="bottom"
      >
        <button
          disabled={$delete_category_mut.isPending}
          class="btn bg-error-600 rounded-md px-2 py-1"
        >
          <Icon src={AiOutlineDelete} class="-mt-1 -mr-1 -ml-1 text-2xl text-white" />
        </button>
      </ConfirmPopover>
      <button
        disabled={!!$is_fetching}
        class={cl_join('btn rounded-md p-0', $is_fetching && 'animate-spin')}
        onclick={refresh}
      >
        <Icon src={RiSystemRefreshLine} class="-mt-1 -mr-1 -ml-1 text-2xl text-white" />
      </button>
    </span>
  {/if}
</div>
<Items />
