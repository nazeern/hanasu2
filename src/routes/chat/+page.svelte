<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from './chat-state.svelte';
	import type { ChatMessage } from './chat-state.svelte';
	import { Dictionary } from '$lib/dictionary.svelte';
	import { createClickHandler } from '$lib/click-handler';

	let { data } = $props();

	const chat = new Chat(data.language, data.testMode);
	const dictionary = new Dictionary();
	onMount(() => {
		chat.connect(data.ephemeralKey);

		return () => {
			chat.close();
		};
	});

	const { handleSingleClick, handleDoubleClick } = createClickHandler<ChatMessage>(
		(e, msg) => {
			const button = (e.target as HTMLElement).closest('button');
			if (!button) return;

			let textNode: Node | null = null;
			let offset = 0;

			const position = document.caretPositionFromPoint(e.clientX, e.clientY);
			if (!position) return;
			textNode = position.offsetNode;
			offset = position.offset;

			// Create a range from the start of the button to the click position
			const fullRange = document.createRange();
			fullRange.setStart(button, 0);
			fullRange.setEnd(textNode, offset);

			// The character index is simply the length of the text up to the click
			const charIndex = fullRange.toString().length;

			dictionary.lookupWord(msg.text, charIndex);
		},
		(msg) => {
			chat.translate(msg);
		}
	);
</script>

<p>CHAT PAGE</p>
<p>Connected: {chat.connected}</p>

<button
	onpointerdown={() => chat.startRecording()}
	onpointerup={() => chat.stopRecording()}
	onpointerleave={() => chat.stopRecording()}
	disabled={!chat.connected}
>
	{#if !chat.connected}
		Connecting...
	{:else if chat.isRecording}
		🎤 Recording... (Release to send)
	{:else}
		🎤 Hold to Talk
	{/if}
</button>

{#each chat.messages as msg (msg.id)}
	<div>
		<p>{msg.from}:</p>
		<button onclick={(e) => handleSingleClick(e, msg)} ondblclick={() => handleDoubleClick(msg)}>
			{msg.text}
		</button>
		{#if msg.translationLoading}
			<p>Translating...</p>
		{/if}
		{#if msg.translatedText}
			<p>{msg.translatedText}</p>
		{/if}
	</div>
{/each}

{#if !dictionary.lookup}
	{null}
{:else if dictionary.lookup.loading}
	<p>Looking up word...</p>
{:else if dictionary.lookup.word}
	<div>
		<p><strong>Word:</strong> {dictionary.lookup.word}</p>

		{#if dictionary.lookup.entries && dictionary.lookup.entries.length}
			<p><strong>Dictionary Entries ({dictionary.lookup.entries.length}):</strong></p>
			{#each dictionary.lookup.entries as entry}
				<div
					style="margin-left: 20px; margin-bottom: 15px; border-left: 2px solid #ccc; padding-left: 10px;"
				>
					<p><strong>Headword:</strong> {entry.word}</p>
					{#if entry.readings.length}
						<p><strong>Readings:</strong> {entry.readings.join(', ')}</p>
					{/if}
					{#if entry.featured.length}
						<p><strong>Tags:</strong> {entry.featured.join(', ')}</p>
					{/if}

					{#if entry.definitions.length}
						<p><strong>Definitions:</strong></p>
						{#each entry.definitions as def, i}
							<div style="margin-left: 15px; margin-bottom: 10px;">
								<p><strong>{i + 1}.</strong> {def.meanings.join('; ')}</p>
								{#if def.parts_of_speech.length}
									<p style="font-style: italic; color: #666;">({def.parts_of_speech.join(', ')})</p>
								{/if}
								{#if def.tags.length}
									<p style="font-size: 0.9em; color: #888;">{def.tags.join(', ')}</p>
								{/if}
								{#if def.example_ja}
									<p><strong>Example:</strong></p>
									<p style="margin-left: 10px;">🇯🇵 {def.example_ja}</p>
									{#if def.example_en}
										<p style="margin-left: 10px;">🇬🇧 {def.example_en}</p>
									{/if}
								{/if}
								{#if def.see_also}
									<p style="font-size: 0.9em;">See also: {def.see_also}</p>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		{:else}
			<p>No dictionary entries found.</p>
		{/if}
	</div>
{/if}
