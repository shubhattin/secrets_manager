<script lang="ts">
  import { Popover, Modal } from '@skeletonlabs/skeleton-svelte';
  import Icon from '~/tools/Icon.svelte';
  import { BiLogOut } from 'svelte-icons-pack/bi';
  import { VscAccount } from 'svelte-icons-pack/vsc';
  import { AiOutlineUser } from 'svelte-icons-pack/ai';
  import { selected_category_id, text_editing_status } from '../state.svelte';
  import { signOut, useSession } from '$lib/auth-client';
  import { useQueryClient } from '@tanstack/svelte-query';

  const query_client = useQueryClient();
  let user_info_popover_status = $state(false);
  let logout_modal_status = $state(false);

  const log_out = async () => {
    logout_modal_status = false;
    await signOut();
    $text_editing_status = false;
    $selected_category_id = null;
    query_client.invalidateQueries({
      queryKey: ['categories']
    });
  };

  const session = useSession();
</script>

<Popover
  bind:open={user_info_popover_status}
  triggerBase="btn m-2 p-0 select-none outline-hidden"
  contentBase="card z-40 pt-1 px-1 shadow-2xl bg-surface-100-900 rounded-lg"
  positioning={{ placement: 'left-start' }}
>
  {#snippet trigger()}
    <Icon class="hover:text-gray-6200 text-3xl dark:hover:text-gray-400" src={VscAccount} />
  {/snippet}
  {#snippet content()}
    <div class="select-none space-y-2 p-1">
      <div class="text-center text-base font-bold">
        <Icon class="-mt-1 text-2xl" src={AiOutlineUser} />
        {$session.data!.user.name}
        {#if $session.data!.user.username}
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >({$session.data!.user.username})</span
          >
        {/if}
      </div>
      <div class="select-none space-y-2 p-1">
        <Modal
          bind:open={logout_modal_status}
          contentBase="card z-50 space-y-2 rounded-lg px-3 py-2 shadow-xl bg-surface-100-900"
          backdropBackground="backdrop-blur-xs"
        >
          {#snippet trigger()}
            <span
              class="btn m-0 gap-1 rounded-md bg-error-600 pb-1 pl-1 pr-2 pt-0 font-bold text-white"
            >
              <Icon class="text-2xl" src={BiLogOut} />
              <span>Logout</span>
            </span>
          {/snippet}
          {#snippet content()}
            <div class="text-lg font-bold">Are you sure to logout ?</div>
            <div class="space-x-2">
              <button
                class="btn rounded-lg font-semibold preset-filled-surface-300-700"
                onclick={log_out}
              >
                Confirm
              </button>
              <button
                onclick={() => (logout_modal_status = false)}
                class="btn rounded-lg font-semibold preset-outlined-surface-800-200"
              >
                Cancel
              </button>
            </div>
          {/snippet}
        </Modal>
      </div>
    </div>
  {/snippet}
</Popover>
