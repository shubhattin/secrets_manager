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
  import { queryClient } from '~/state/query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  initializeStores();
  // set up the floating UI for popups
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  user_info.value = data.user_info;
</script>

<Modal />
<ModeWatcher />
<div class="contaiiner mx-auto mb-1 max-w-screen-lg">
  <QueryClientProvider client={queryClient}>
    {@render children()}
    <SvelteQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
</div>
