<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import TopAppBar from '~/components/TopAppBar.svelte';
  import { user_info } from '~/state/user.svelte';
  import { ensure_auth_access_status, get_id_token_info } from '~/tools/auth_tools';
  import type { PageData } from './$types';

  onMount(async () => {
    if (browser) await ensure_auth_access_status();
    try {
      user_info.value = get_id_token_info().user;
    } catch {}
  });
</script>

<TopAppBar />
