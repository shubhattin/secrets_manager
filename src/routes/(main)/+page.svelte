<script lang="ts">
  import MainApp from '~/components/pages/main/MainApp.svelte';
  import Login from '~/components/pages/main/user/Login.svelte';
  import UserControls from '~/components/pages/main/user/UserControls.svelte';
  import { useSession } from '$lib/auth-client';
  import type { PageData } from './$types';
  import { browser } from '$app/environment';

  const session = useSession();

  let { data }: { data: PageData } = $props();

  let user_info_fetched = $state(false);

  let user_info = $derived(user_info_fetched ? $session.data?.user : data.user_info);

  $effect(() => {
    if (browser && $session.data?.user) {
      user_info_fetched = true;
    }
  });
</script>

<svelte:head>
  <title>Secrets</title>
</svelte:head>
{#if !user_info}
  <Login />
{:else}
  <div class="flex justify-end">
    <UserControls />
  </div>
  <MainApp />
{/if}
