<script lang="ts">
  import { client_q } from '~/api/client';
  import Spinner from '~/components/Spinner.svelte';
  import { user_info } from '~/state/user.svelte';
  import { cl_join } from '~/tools/cl_join';
  import { get_id_token_info, storeAuthInfo } from '~/tools/auth_tools';
  import { slide } from 'svelte/transition';

  let username = $state(''); // 1st user(admin)
  let password = $state('');
  let pass_input_element = $state<HTMLInputElement>();
  let user_input_element = $state<HTMLInputElement>();

  let wrong_pass_status = $state(false);
  let user_not_found_status = $state(false);

  const pass_verify = client_q.auth.verify_pass.mutation({
    onSuccess(data) {
      if (!data.verified) {
        const err_code = data.err_code;
        wrong_pass_status = false;
        user_not_found_status = false;
        if (err_code === 'user_not_found') {
          username = '';
          password = '';
          user_not_found_status = true;
          user_input_element && user_input_element.focus();
        } else if (err_code === 'wrong_password') {
          password = '';
          pass_input_element && pass_input_element.focus();
          wrong_pass_status = true;
        }
      } else {
        storeAuthInfo(data);
        $user_info = get_id_token_info().user;
      }
    }
  });

  const check_pass_func = async () => {
    if (password === '') return;
    $pass_verify.mutate({ username, password });
  };
</script>

<div class="flex justify-center" in:slide>
  <form onsubmit={check_pass_func} class="mt-2 w-full space-y-2.5 sm:w-4/5 md:w-3/5">
    <input
      type="text"
      bind:this={user_input_element}
      bind:value={username}
      placeholder="Username"
      class={cl_join('input variant-form-material', user_not_found_status && 'input-warning')}
    />
    <input
      class={cl_join('input variant-form-material', wrong_pass_status && 'input-error')}
      type="password"
      bind:this={pass_input_element}
      bind:value={password}
      placeholder="Password"
      minlength={6}
      required
    />
    <button type="submit" class="btn rounded-lg bg-tertiary-700 py-1 pl-0 pr-4 font-semibold">
      <Spinner show={$pass_verify.isPending} />
      <span class="text-white">Submit</span>
    </button>
  </form>
</div>
