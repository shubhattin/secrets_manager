<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { storePopup, Modal, initializeStores } from '@skeletonlabs/skeleton';
  import '@fontsource/roboto/latin.css';
  import { browser } from '$app/environment';
  import '../app.pcss';
  import type { LayoutData } from './$types';
  import { user_info } from '~/state/user.svelte';
  import type { Snippet } from 'svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  initializeStores();
  // set up the floating UI for popups
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });

  user_info.value = data.user_info;
</script>

<Modal />
<ModeWatcher />
<div class="contaiiner mx-auto mb-1 max-w-screen-lg">
  <QueryClientProvider client={queryClient}>
    {@render children()}
  </QueryClientProvider>
</div>
