<script lang="ts">
  import { type client } from '~/api/client';
  import { decrypt_text } from '~/tools/encrypt_decrypt';

  type item_type = Awaited<ReturnType<typeof client.data.items.get_items.query>>[0];

  let { item, passkey }: { item: item_type; passkey: string } = $props();

  let get_decrypted = async () => {
    const description = await decrypt_text(item.description_encrypted, passkey);
    const text = await decrypt_text(item.text_encrypted, passkey);
    return { description, text };
  };
</script>

<div class="space-y-0">
  {#await get_decrypted() then decrypted}
    <div>
      <span class="text-xl font-bold">{decrypted.description}</span>
    </div>
    <div>{decrypted.text}</div>
  {/await}
</div>
