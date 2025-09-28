# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

For project guidelines, see the `docs/` folder, containing:
- `docs/architecture.md`: Best practices for implementing features, how to read/write data, and handling client state.
- `docs/gotchas.md`: Common mistakes to avoid, along with tips and tricks.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
