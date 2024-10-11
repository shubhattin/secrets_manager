<script lang="ts">
  import { selected_category_id } from './state.svelte';
  import { type client } from '~/api/client';

  type item_type = Awaited<ReturnType<typeof client.data.items.get_items.query>>[0];

  let { item }: { item: item_type } = $props();
</script>

<div class="space-y-2">
  <div class="font-bold">{item.description_encrypted}</div>
  <div>{item.text_encrypted}</div>
</div>
