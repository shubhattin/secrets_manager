<script lang="ts">
  import { selected_category_id } from './state.svelte';
  import Category from './Category.svelte';
  import CateogoryList from './CateogoryList.svelte';
  import { scale, slide } from 'svelte/transition';
</script>

{#if !selected_category_id.value}
  <div in:scale out:slide>
    <CateogoryList />
  </div>
{:else}
  <div in:scale out:slide>
    <Category />
  </div>
{/if}
