<script lang="ts">
  import { cl_join } from '~/tools/cl_join';
  import { scale, slide } from 'svelte/transition';
  import { signIn } from '$lib/auth-client';
  import { delay } from '~/tools/delay';
  import { createMutation } from '@tanstack/svelte-query';
  import { AiOutlineGithub, AiOutlineGoogle } from 'svelte-icons-pack/ai';
  import Icon from '~/tools/Icon.svelte';
  import { GoogleIcon } from '~/components/icons';

  let username = $state(''); // 1st user(admin)
  let password = $state('');

  let wrong_pass_or_user_status = $state(false);

  const pass_verify = createMutation({
    mutationFn: async () => {
      await delay(550);
      const { data, error } = await signIn.username({ username, password });
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
    if (password === '' || username.length < 2) return;
    await $pass_verify.mutateAsync();
  };
</script>

<div class="flex flex-col items-center justify-center" in:slide>
  <form
    onsubmit={check_pass_func}
    class="mt-8 mb-4 flex w-4/5 flex-col items-center justify-center space-y-2.5 sm:w-3/5 md:w-2/5"
  >
    <input
      type="text"
      bind:value={username}
      placeholder="Username"
      class={cl_join('input block rounded-md px-2 py-1')}
    />
    <input
      class={cl_join(
        'input block rounded-md px-2 py-1',
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
    <button
      type="submit"
      disabled={$pass_verify.isPending}
      class="btn gap-0 rounded-md bg-primary-700 px-2 py-0"
    >
      <span class="text-white">Login</span>
    </button>
  </form>
  <div class="grid grid-cols-1 items-center justify-center gap-y-2 sm:grid-cols-2 sm:gap-x-2">
    <button
      onclick={async () => {
        const data = await signIn.social({
          provider: 'github',
          callbackURL: '/'
        });
      }}
      class="btn flex gap-2 rounded-lg preset-outlined-tertiary-700-300 font-semibold"
      ><Icon src={AiOutlineGithub} class="inline-block text-2xl" />Login with Github</button
    >
    <button
      onclick={async () => {
        const data = await signIn.social({
          provider: 'google',
          callbackURL: '/'
        });
      }}
      class="btn flex gap-2 rounded-lg preset-outlined-secondary-700-300 font-semibold"
      ><Icon src={GoogleIcon} class="inline-block text-[1.25rem]" />Login with Google</button
    >
  </div>
</div>
