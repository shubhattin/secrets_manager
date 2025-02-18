<script lang="ts">
  import MainApp from '~/components/pages/main/MainApp.svelte';
  import Login from '~/components/pages/main/user/Login.svelte';
  import UserControls from '~/components/pages/main/user/UserControls.svelte';
  import { authClient } from '$lib/auth-client';

  const session = authClient.useSession();
</script>

<svelte:head>
  <title>Secrets</title>
</svelte:head>
{#if !$session.data}
  <Login />
{:else}
  <div class="flex justify-end">
    <UserControls />
  </div>
  <MainApp />
{/if}
