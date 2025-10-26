<script>
	import GoogleButton from '$lib/components/GoogleButton.svelte';
</script>

<form method="POST" action="/login?/googleSignIn" class="row flex flex-center">
	<GoogleButton />
</form>
