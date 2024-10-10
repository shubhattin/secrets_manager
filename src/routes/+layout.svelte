<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { storePopup, Modal, initializeStores } from '@skeletonlabs/skeleton';
  import '@fontsource/roboto/latin.css';
  import '../app.pcss';
  import type { LayoutData } from './$types';
  import { user_info } from '~/state/user.svelte';
  import type { Snippet } from 'svelte';
  import { queryClient } from '~/state/queryClient';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
  import TopAppBar from '~/components/TopAppBar.svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  initializeStores();
  // set up the floating UI for popups
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  user_info.value = data.user_info;
</script>

<QueryClientProvider client={queryClient}>
  <Modal />
  <ModeWatcher />
  <div class="contaiiner mx-auto mb-1 max-w-screen-lg">
    <TopAppBar />
    <div class="mx-2">
      {@render children()}
    </div>
  </div>
  <SvelteQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
