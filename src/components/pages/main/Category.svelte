<script lang="ts">
  import { AiOutlineDelete, AiOutlineEdit } from 'svelte-icons-pack/ai';
  import { selected_category_id, categories, CATEGORY_QUERY_KEY } from './state.svelte';
  import Icon from '~/tools/Icon.svelte';
  import { TiArrowBackOutline } from 'svelte-icons-pack/ti';
  import { client_q } from '~/api/client';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { getModalStore } from '@skeletonlabs/skeleton';

  const modalStore = getModalStore();
  const query_client = useQueryClient();

  let cateogory = $derived($categories.data!.filter((c) => c.id === selected_category_id.value)[0]);

  const delete_category_mut = client_q.data.categories.delete_category.mutation({
    async onSuccess() {
      query_client.setQueryData(
        CATEGORY_QUERY_KEY,
        $categories.data!.filter((c) => c.id !== cateogory.id)
      );
      selected_category_id.value = null;
    }
  });

  const delete_category_func = async () => {
    modalStore.trigger({
      type: 'confirm',
      title: 'Please Confirm',
      body: 'Are you sure you delete this Cateogory ?',
      response: (r: boolean) => {
        if (r) {
          $delete_category_mut.mutate({
            category_id: cateogory.id
          });
        }
      }
    });
  };
</script>

<div class="flex space-x-7">
  <span class="space-x-2">
    <button class="btn m-0 p-0 outline-none" onclick={() => (selected_category_id.value = null)}>
      <Icon src={TiArrowBackOutline} class="-mt-3 text-2xl" />
    </button>
    <span class="text-2xl font-bold">{cateogory.description}</span>
  </span>
  <span class="space-x-3 outline-none">
    <button
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
</div>
