# Hanasu

Learn language through natural conversation, powered by AI. 

Users can see a transcript of the conversation in their target language (such as Japanese), and simply
tap to translate & solidify their understanding.

Users can tap a word to view an integrated dictionary, and save those words into their vocab.
Users can study this saved vocabulary used science-backed spaced repetition.

The chat agent also provides useful tips, helping to correct grammar mistakes or unnatural speech.

## Developing

For project guidelines, see the `docs/` folder, containing:
- `docs/architecture.md`: Best practices for implementing features, how to read/write data, and handling client state.
- `docs/gotchas.md`: Common mistakes to avoid, along with tips and tricks.

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
