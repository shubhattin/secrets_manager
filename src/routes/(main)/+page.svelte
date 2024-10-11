<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import MainApp from '~/components/pages/main/MainApp.svelte';
  import Login from '~/components/pages/main/user/Login.svelte';
  import UserControls from '~/components/pages/main/user/UserControls.svelte';
  import { user_info } from '~/state/user.svelte';
  import { ensure_auth_access_status } from '~/tools/auth_tools';

  onMount(async () => {
    if (browser) await ensure_auth_access_status();
  });
</script>

<svelte:head>
  <title>Secrets</title>
</svelte:head>
{#if !$user_info}
  <Login />
{:else}
  <div class="flex justify-end">
    <UserControls />
  </div>
  <MainApp />
{/if}
