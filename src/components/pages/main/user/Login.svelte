<script lang="ts">
  import Spinner from '~/components/Spinner.svelte';
  import { cl_join } from '~/tools/cl_join';
  import { scale, slide } from 'svelte/transition';
  import { authClient } from '$lib/auth-client';
  import { delay } from '~/tools/delay';
  import { createMutation } from '@tanstack/svelte-query';

  let username = $state(''); // 1st user(admin)
  let password = $state('');

  let wrong_pass_or_user_status = $state(false);

  const pass_verify = createMutation({
    mutationFn: async () => {
      await delay(550);
      const { data, error } = await authClient.signIn.username({ username, password });
      if (error) {
        const err_code = error.code;
        wrong_pass_or_user_status = false;
        if (err_code === 'INVALID_USERNAME_OR_PASSWORD') {
          wrong_pass_or_user_status = true;
        }
      }
      return data;
    }
  });

  const check_pass_func = async (e: Event) => {
    e.preventDefault();
    if (password === '' || username.length < 5) return;
    await $pass_verify.mutateAsync();
  };
</script>

<div class="flex justify-center" in:slide>
  <form onsubmit={check_pass_func} class="mt-2 w-full space-y-2.5 sm:w-4/5 md:w-3/5">
    <input
      type="text"
      bind:value={username}
      placeholder="Username"
      class={cl_join('input rounded-md px-2 py-1')}
    />
    <input
      class={cl_join(
        'input rounded-md px-2 py-1',
        wrong_pass_or_user_status && 'preset-tonal-error'
      )}
      type="password"
      bind:value={password}
      placeholder="Password"
      minlength={6}
      required
    />
    {#if wrong_pass_or_user_status}
      <div in:scale class="text-sm text-error-500">Invalid Username or Password</div>
    {/if}
    <button type="submit" class="btn gap-0 rounded-lg bg-primary-800 py-1 pl-0 pr-4 font-semibold">
      <Spinner show={$pass_verify.isPending} />
      <span class="text-white">Submit</span>
    </button>
  </form>
</div>
