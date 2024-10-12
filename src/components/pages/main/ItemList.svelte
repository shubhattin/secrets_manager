<script lang="ts">
  import { slide } from 'svelte/transition';
  import { items_q } from './state.svelte';
  import Icon from '~/tools/Icon.svelte';
  import { AiOutlinePlus } from 'svelte-icons-pack/ai';
  import { RiSystemCloseLargeFill } from 'svelte-icons-pack/ri';
  import { VscAdd } from 'svelte-icons-pack/vsc';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { client_q } from '~/api/client';
  import { get_item_query_key, selected_category_id } from './state.svelte';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import { cl_join } from '~/tools/cl_join';
  import { TiTick } from 'svelte-icons-pack/ti';
  import { encrypt_text, decrypt_text } from '~/tools/encrypt_decrypt';
  import Item from './Item.svelte';
  import { OiUnlock16 } from 'svelte-icons-pack/oi';
  import { get_textarea_height } from '~/tools/kry';

  const modalStore = getModalStore();
  const query_client = useQueryClient();
  let new_item_add_opened = $state(false);
  let new_item_name = $state('');
  let new_item_name_element = $state<HTMLInputElement>();
  let new_item_text = $state('');

  let pass_unlocked = $state(false);
  let passkey = $state('');
  let passkey_element = $state<HTMLInputElement>();

  $effect(() => {
    passkey_element?.focus();
  });

  const add_item_mut = client_q.data.items.add_item.mutation({
    async onSuccess(new_data) {
      new_item_text = '';
      new_item_text = '';
      new_item_add_opened = false;
      const old_data = $items_q.data!;
      query_client.setQueryData(get_item_query_key($selected_category_id!), [
        new_data,
        ...old_data
      ]);
    }
  });

  function add_new_iteam_func() {
    modalStore.trigger({
      type: 'confirm',
      title: 'Please Confirm',
      body: 'Are you sure you want to add a new item ?',
      response: (resp: boolean) =>
        resp &&
        (async () => {
          const description_encrypted = await encrypt_text(new_item_name, passkey);
          const text_encrypted = await encrypt_text(new_item_text, passkey);
          $add_item_mut.mutate({
            category_id: $selected_category_id!,
            description_encrypted,
            text_encrypted
          });
        })()
    });
  }

  async function set_passkey_func() {
    if ($items_q.data && $items_q.data.length !== 0) {
      // we to verify it its true
      try {
        const name = $items_q.data![0].description_encrypted;
        const decrypted = await decrypt_text(name, passkey);
        pass_unlocked = decrypted === passkey;
        pass_unlocked = true;
      } catch {
        passkey = '';
        passkey_element?.focus();
      }
    } else if (passkey !== '' && passkey.length >= 3) {
      pass_unlocked = true;
    }
  }
</script>

{#if !$items_q.isFetching && $items_q.isSuccess}
  {@render add_new_item()}
  {#if !pass_unlocked}
    {@const passkey_is_set = $items_q.data && $items_q.data.length !== 0}
    <form onsubmit={set_passkey_func} class="mt-3.5 space-x-3" out:slide>
      <input
        type="password"
        bind:value={passkey}
        bind:this={passkey_element}
        min={3}
        placeholder={passkey_is_set ? 'Passkey' : 'Set Passkey'}
        class="input w-3/5 rounded-md px-2 py-1"
      />
      <button
        type="submit"
        class={cl_join(
          'btn rounded-md px-2 py-1 text-white outline-none',
          !passkey_is_set ? 'bg-green-600' : 'bg-amber-600'
        )}
      >
        {#if !passkey_is_set}
          <Icon src={TiTick} class="-mx-2 -my-2 text-3xl" />
        {:else}
          <Icon src={OiUnlock16} class="-mx-1 -mt-1 text-2xl" />
        {/if}
      </button>
    </form>
  {:else if $items_q.data!.length === 0}
    <div class="mt-3.5 p-2 text-xl font-bold">No Items</div>
  {:else}
    <div class="mt-4 space-y-3">
      {#each $items_q.data as item (item.id)}
        <Item {item} {passkey} />
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

{#snippet add_new_item()}
  <button
    disabled={!pass_unlocked || new_item_add_opened}
    onclick={() => {
      new_item_add_opened = true;
      setTimeout(() => {
        new_item_name_element && new_item_name_element.focus();
      }, 400 + 50);
    }}
    class="btn space-x-1 rounded-lg bg-tertiary-700 px-2 py-1 font-bold text-white outline-none dark:bg-tertiary-700"
  >
    <Icon src={VscAdd} class="text-2xl" />
    <span>Add New</span>
  </button>
  {#if new_item_add_opened}
    <div transition:slide class="mt-2 space-y-2">
      <div class="space-x-3">
        <input
          type="text"
          min={3}
          max={60}
          required
          bind:this={new_item_name_element}
          bind:value={new_item_name}
          placeholder="Description"
          class="input inline-block w-3/5 rounded-md py-1 text-sm"
        />
        <button
          onclick={add_new_iteam_func}
          class="btn rounded-lg bg-primary-700 px-2 py-1 font-bold text-white dark:bg-primary-700"
        >
          <Icon src={AiOutlinePlus} class="-mx-1 -my-1 text-2xl" />
        </button>
        <button
          onclick={() => (new_item_add_opened = false)}
          class="btn rounded-md bg-error-600 px-1 py-1 text-white dark:bg-error-500"
        >
          <Icon src={RiSystemCloseLargeFill} class="-mt-1 text-xl" />
        </button>
      </div>
      <textarea
        bind:value={new_item_text}
        class="textarea min-h-28 w-5/6 rounded-md px-2 py-1 text-sm"
        style:height={get_textarea_height(new_item_text, 1.25, 4)}
      ></textarea>
    </div>
  {/if}
{/snippet}
