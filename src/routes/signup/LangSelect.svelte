<script>
	import { langInfoList } from '$lib/constants';
</script>

<div class="w-full flex flex-col gap-1">
	<label for="lang-input">Preferred Language</label>
	<select class="p-1 border border-border rounded-lg bg-neutral-100" name="lang" id="lang-input">
		{#each langInfoList as langInfo}
			<option value={langInfo.code}>{langInfo.displayName} {langInfo.emoji}</option>
		{/each}
	</select>
</div>
