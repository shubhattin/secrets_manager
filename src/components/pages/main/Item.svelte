<script lang="ts">
  import { AiOutlineDelete, AiOutlineEdit } from 'svelte-icons-pack/ai';
  import { fade, slide } from 'svelte/transition';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { client_q } from '~/api/client';
  import {
    get_item_query_key,
    selected_category_id,
    items_q,
    text_editing_status
  } from './state.svelte';
  import { type client } from '~/api/client';
  import { decrypt_text, encrypt_text } from '~/tools/encrypt_decrypt';
  import Icon from '~/tools/Icon.svelte';
  import { get_textarea_height } from '~/tools/kry';
  import { AiOutlineClose } from 'svelte-icons-pack/ai';
  import { TiTick } from 'svelte-icons-pack/ti';
  import ConfirmPopover from '~/components/PopoverModals/ConfirmPopover.svelte';

  type item_type = Awaited<ReturnType<typeof client.data.items.get_items.query>>[0];
  let { item, passkey }: { item: item_type; passkey: string } = $props();

  const query_client = useQueryClient();

  $effect(() => {
    $text_editing_status = item_edit_status;
  });

  let get_decrypted = async () => {
    const description = await decrypt_text(item.description_encrypted, passkey);
    const text = await decrypt_text(item.text_encrypted, passkey);
    return { description, text };
  };

  let item_edit_status = $state(false);
  let updated_item_name = $state('');
  let updated_item_text = $state('');

  let delete_popup_state = $state(false);
  let edit_popup_state = $state(false);

  const delete_item_mut = client_q.data.items.delete_item.mutation({
    async onSuccess() {
      query_client.setQueryData(
        get_item_query_key($selected_category_id!),
        $items_q.data!.filter((c) => c.id !== item.id)
      );
    }
  });

  const edit_item_mut = client_q.data.items.update_item.mutation({
    async onSuccess(data) {
      query_client.setQueryData(
        get_item_query_key($selected_category_id!),
        $items_q.data!.map((c) => (c.id !== item.id ? c : { ...c, ...data! }))
      );
      updated_item_name = '';
      item_edit_status = false;
    }
  });
</script>

<div class="space-y-0">
  {#await get_decrypted() then decrypted}
    {#if !item_edit_status}
      <div class="space-x-4">
        <span class="text-lg font-bold">{decrypted.description}</span>
        <span class="space-x-0" in:fade>
          <button
            disabled={$text_editing_status || $delete_item_mut.isPending}
            onclick={() => {
              item_edit_status = true;
              updated_item_name = decrypted.description;
              updated_item_text = decrypted.text;
            }}
            class="btn rounded-md px-1 py-1 outline-none"
          >
            <Icon src={AiOutlineEdit} class="-mt-1 text-xl" />
          </button>
          <ConfirmPopover
            description="Are you sure you want to delete this item ?"
            placement="top"
            bind:popup_state={delete_popup_state}
            confirm_func={() => {
              $delete_item_mut.mutate({
                category_id: $selected_category_id!,
                item_id: item.id
              });
              delete_popup_state = false;
            }}
          >
            <button
              disabled={$delete_item_mut.isPending}
              class="btn rounded-md px-2 py-0 outline-none"
            >
              <Icon src={AiOutlineDelete} class="-mt-1 text-xl" />
            </button>
          </ConfirmPopover>
        </span>
      </div>
      <div class="rounded-md border-2 border-gray-300 p-1 text-sm dark:border-gray-700">
        {#each decrypted.text.split('\n') as line}
          <div>{line === '' ? '\u200c' : line}</div>
        {/each}
      </div>
    {:else}
      <div class="space-y-1" transition:slide>
        <div class="space-x-3">
          <input
            type="text"
            min={3}
            max={60}
            required
            bind:value={updated_item_name}
            placeholder="Description"
            class="input inline-block w-3/5 rounded-md py-1 text-sm"
          />
          <span class="space-x-1">
            <ConfirmPopover
              description="Please Confirm"
              placement="top"
              bind:popup_state={edit_popup_state}
              confirm_func={async () => {
                $edit_item_mut.mutate({
                  category_id: $selected_category_id!,
                  id: item.id,
                  description_encrypted: await encrypt_text(updated_item_name, passkey),
                  text_encrypted: await encrypt_text(updated_item_text, passkey)
                });
                edit_popup_state = false;
              }}
            >
              <button
                disabled={$edit_item_mut.isPending}
                class="btn m-0 rounded-md p-0 outline-none"
              >
                <Icon src={TiTick} class="-m-1 text-2xl" />
              </button>
            </ConfirmPopover>
            <button
              disabled={$edit_item_mut.isPending}
              onclick={() => (item_edit_status = false)}
              class="btn m-0 rounded-md p-0 outline-none"
            >
              <Icon src={AiOutlineClose} class="-m-1 text-xl" />
            </button>
          </span>
        </div>
        <textarea
          bind:value={updated_item_text}
          class="textarea w-5/6 rounded-md px-2 py-1 text-sm"
          style:height={get_textarea_height(updated_item_text, 1.25, 4)}
        ></textarea>
      </div>
    {/if}
  {/await}
</div>
