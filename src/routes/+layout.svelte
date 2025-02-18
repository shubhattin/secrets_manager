<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '~/state/queryClient';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
  import TopAppBar from '~/components/TopAppBar.svelte';
  import { type Snippet } from 'svelte';
  import '@fontsource/roboto/latin.css';
  import '../app.pcss';

  let { children }: { children: Snippet } = $props();
</script>

<QueryClientProvider client={queryClient}>
  <ModeWatcher />
  <div class="contaiiner mx-auto mb-1 max-w-screen-lg">
    <TopAppBar />
    <div class="mx-2">
      {@render children()}
    </div>
  </div>
  <SvelteQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
