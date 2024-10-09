<script lang="ts">
  import Icon from '~/tools/Icon.svelte';
  import { getModalStore, popup } from '@skeletonlabs/skeleton';
  import type { ModalSettings } from '@skeletonlabs/skeleton';
  import { BiLogOut } from 'svelte-icons-pack/bi';
  import { deleteAuthCookies } from '~/tools/auth_tools';
  import { user_info } from '~/state/user.svelte';
  import { VscAccount } from 'svelte-icons-pack/vsc';
  import { AiOutlineUser } from 'svelte-icons-pack/ai';

  const modalStore = getModalStore();

  const log_out = () => {
    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Are you Sure to Log Out ?',
      response: (resp: boolean) => {
        if (!resp) return;
        deleteAuthCookies();
        user_info.value = undefined;
      }
    };
    modalStore.trigger(modal);
  };
</script>

<button
  class="btn m-2 p-0"
  use:popup={{
    event: 'click',
    target: 'user_info',
    placement: 'left-start'
  }}
>
  <Icon class="hover:text-gray-6200 text-3xl dark:hover:text-gray-400" src={VscAccount} />
</button>
<div class="card z-40 px-1 py-2 shadow-2xl" data-popup="user_info">
  <div class="select-none space-y-2 p-1">
    <div class="text-center text-base font-bold">
      <Icon class="-mt-1 text-2xl" src={AiOutlineUser} />
      {user_info.value!.name}
      <span class="text-sm text-gray-500 dark:text-gray-400">({user_info.value!.username})</span>
    </div>
    <div class="select-none space-y-2 p-1">
      <button
        on:click={log_out}
        class="variant-filled-error btn m-0 rounded-md pb-1 pl-1 pr-2 pt-0 font-bold"
      >
        <Icon class="text-2xl" src={BiLogOut} />
        <span>Logout</span>
      </button>
    </div>
  </div>
</div>
