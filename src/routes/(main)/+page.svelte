<script lang="ts">
  import MainApp from '~/components/pages/main/MainApp.svelte';
  import Login from '~/components/pages/main/user/Login.svelte';
  import UserControls from '~/components/pages/main/user/UserControls.svelte';
  import { authClient } from '$lib/auth-client';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  const session = authClient.useSession();

  let { data }: { data: PageData } = $props();

  let mounted = $state(false);

  onMount(() => {
    if (browser) mounted = true;
  });

  let user_info = $derived(mounted ? ($session.data?.user ?? data.user_info) : data.user_info);
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
