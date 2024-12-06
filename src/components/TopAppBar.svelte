<script lang="ts">
  import { AppBar, Popover } from '@skeletonlabs/skeleton-svelte';
  import ThemeChanger from './ThemeChanger.svelte';
  import Icon from '~/tools/Icon.svelte';
  import { SiGithub } from 'svelte-icons-pack/si';
  import { AiOutlineMenu } from 'svelte-icons-pack/ai';
  import { page } from '$app/stores';
  import { main_app_bar_info } from '~/state/app_bar.svelte';
  import { PAGE_TITLES } from '~/state/page_titles';
  import type { Snippet } from 'svelte';

  let { start, headline, end }: { start?: Snippet; headline?: Snippet; end?: Snippet } = $props();
  let page_url = $derived($page.url.pathname);

  $effect(() => {
    if (page_url in PAGE_TITLES) {
      const [TITLE, CLASS]: string[] = PAGE_TITLES[page_url as keyof typeof PAGE_TITLES];
      $main_app_bar_info = {
        title: TITLE,
        className: CLASS
      };
    } else if ($page.error) {
      $main_app_bar_info = {
        title: undefined,
        className: undefined
      };
    }
  });
  let app_bar_popover_status = $state(false);
</script>

<AppBar>
  {#snippet lead()}
    {#if start}
      {@render start()}
    {/if}
    {#if headline}
      {@render headline()}
    {:else}
      <span class={$main_app_bar_info.className ?? ''}>{$main_app_bar_info.title ?? ''}</span>
    {/if}
  {/snippet}
  {#snippet trail()}
    {@render end?.()}
    <Popover
      bind:open={app_bar_popover_status}
      positioning={{ placement: 'left-start' }}
      arrow={false}
      contentBase="card z-50 space-y-2 rounded-lg px-3 py-2 shadow-xl bg-surface-100-900"
      triggerBase="btn m-0 p-0 gap-0"
    >
      {#snippet trigger()}
        <Icon
          src={AiOutlineMenu}
          class="text-3xl outline-none hover:text-gray-500 active:text-blue-600 dark:hover:text-gray-400 dark:active:text-blue-400"
        />
      {/snippet}
      {#snippet content()}
        <a
          href="https://github.com/shubhattin/secrets_manager"
          target="_blank"
          rel="noopener noreferrer"
          class="will-close group flex space-x-1 rounded-md px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          onclick={() => (app_bar_popover_status = false)}
        >
          <Icon
            src={SiGithub}
            class="-mt-1 mr-1 text-2xl group-hover:fill-indigo-700 dark:group-hover:fill-zinc-400"
          />
          <span>Github</span>
        </a>
        <div class="wont-close flex space-x-3 rounded-md px-2 py-1">
          <span class="mt-1">Set Theme</span>
          <ThemeChanger />
        </div>
      {/snippet}
    </Popover>
  {/snippet}
</AppBar>
