import logger from '$lib/logger';
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { OPENAI_SECRET_KEY } from '$env/static/private';
import { isString } from '$lib/util';
import type { ChatMessage } from '../chat-state.svelte';

function buildContextPrompt(recentMessages: ChatMessage[], currentText: string): string {
	if (!recentMessages?.length) {
		return '';
	}

	const context = recentMessages
		.map((msg) => `${msg.from === 'user' ? 'Learner' : 'Tutor'}: ${msg.text}`)
		.join('\n');

	return `\n\nRecent conversation context:\n${context}\nLearner: ${currentText}\n`;
}

function createSystemPrompt(language: string): string {
	return `You are an expert ${language} language tutor. Your role is to help learners improve their ${language} by providing gentle, constructive feedback on grammar and naturalness.

When analyzing a learner's ${language} sentence:
1. If the sentence has grammar errors or sounds unnatural, provide ONE concise tip (1-2 sentences max)
2. Focus on the most important issue - don't overwhelm with multiple corrections
3. Be encouraging and specific - explain what to fix and why
4. If the sentence is grammatically correct and natural, respond with exactly: "null"

Your response should ONLY be the tip or "null". Do not include any other text, explanations, or formatting.`;
}

function createUserPrompt(language: string, text: string, contextPrompt: string): string {
	return `Analyze this ${language} sentence for grammar errors or unnatural phrasing: "${text}"${contextPrompt}

Provide a concise tip in English, or respond with "null" if the sentence is correct.`;
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_SECRET_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-4o',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt }
			],
			temperature: 0.3,
			max_tokens: 150
		})
	});

	if (!response.ok) {
		logger.error({ status: response.status }, 'OpenAI API request failed');
		throw new Error('OpenAI API request failed');
	}

	const result = await response.json();
	const content = result.choices?.[0]?.message?.content?.trim();

	if (!isString(content)) {
		throw new Error('Invalid response from OpenAI');
	}

	return content;
}

export const POST: RequestHandler = async ({ request }) => {
	const { text, langDisplayName, recentMessages } = await request.json();

	// Validate inputs
	if (!isString(text) || !text.trim()) {
		return error(400, { message: 'Text is required and must be a non-empty string' });
	}

	if (!isString(langDisplayName)) {
		return error(400, { message: 'Language display name is required' });
	}

	try {
		const contextPrompt = buildContextPrompt(recentMessages, text);
		const systemPrompt = createSystemPrompt(langDisplayName);
		const userPrompt = createUserPrompt(langDisplayName, text, contextPrompt);

		const tipText = await callOpenAI(systemPrompt, userPrompt);
		const tip = tipText.toLowerCase() === 'null' ? null : tipText;

		return json({ tip });
	} catch (err) {
		logger.error({ error: err }, 'AI assist error');
		return error(500, { message: 'AI assist failed' });
	}
};
