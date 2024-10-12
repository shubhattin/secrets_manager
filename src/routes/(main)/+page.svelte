<script lang="ts">
  import MainApp from '~/components/pages/main/MainApp.svelte';
  import Login from '~/components/pages/main/user/Login.svelte';
  import UserControls from '~/components/pages/main/user/UserControls.svelte';
  import { user_info } from '~/state/user.svelte';
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
