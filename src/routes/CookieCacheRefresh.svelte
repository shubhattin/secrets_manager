<script lang="ts">
  import { COOKIE_CACHE_TIME_MS } from '$lib/cache-time';
  import { useSession, authClient } from '$lib/auth-client';
  import { onDestroy } from 'svelte';

  const session = useSession();

  let CACHE_UPDATE_INTERVAL: NodeJS.Timeout | null = null;

  $effect(() => {
    if (!CACHE_UPDATE_INTERVAL && $session.data?.user.id) {
      CACHE_UPDATE_INTERVAL = setInterval(async () => {
        const data = await authClient.getSession();
      }, COOKIE_CACHE_TIME_MS);
      console.log('Refreshing cookie cache');
    } else if (!$session.data?.user.id && CACHE_UPDATE_INTERVAL) {
      clearInterval(CACHE_UPDATE_INTERVAL);
      CACHE_UPDATE_INTERVAL = null;
      console.log('Stopping cookie cache refresh');
    }
  });

  onDestroy(() => {
    if (CACHE_UPDATE_INTERVAL) {
      clearInterval(CACHE_UPDATE_INTERVAL);
      CACHE_UPDATE_INTERVAL = null;
    }
  });
</script>
