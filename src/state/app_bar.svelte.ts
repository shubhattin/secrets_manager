import { writable } from 'svelte/store';

export let main_app_bar_info = writable<{
  title?: string;
  className?: string;
}>({
  title: undefined,
  className: undefined
});
