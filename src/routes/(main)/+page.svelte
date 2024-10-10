<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import MainApp from '~/components/pages/main/MainApp.svelte';
  import Login from '~/components/pages/main/user/Login.svelte';
  import UserControls from '~/components/pages/main/user/UserControls.svelte';
  import TopAppBar from '~/components/TopAppBar.svelte';
  import { user_info } from '~/state/user.svelte';
  import { ensure_auth_access_status, get_id_token_info } from '~/tools/auth_tools';

  onMount(async () => {
    if (browser) await ensure_auth_access_status();
  });
</script>

<TopAppBar />
{#if !user_info.value}
  <Login />
{:else}
  <div class="flex justify-end">
    <UserControls />
  </div>
  <MainApp />
{/if}
