# Architecture Overview

> Capture how the pieces fit together so new contributors can orient quickly.

## System Context

This project is built using SvelteKit as a frontend framework, and Supabase as the backend provider.

## Project Structure
```
/ (root)
├─ src/
│  ├─ lib/
│  ├─ routes/
│  └─ ...
├─ static/
└─ docs/
```
- The project structure is based on Svelte 5. You can find docs at https://svelte.dev/docs/kit/project-structure.
- Prefer Typescript over Javascript wherever possible.
- The routes/ directory defines what pages can be served by the client.

## Major Modules
- **UI Layer**: key components/pages, routing strategy
  - The UI for a given route is defined in a +page.svelte file.
  - It reads data from the $props function.
  - Styling is done with Tailwind CSS with an inline class string.
  - In general, prefer repeatable UI components.

- **State Management**: stores, derived values, persistence
  - The client state is generally defined by $state within a +page.svelte file.
  - Larger or more complex state is handled by Javascript classes within a .svelte.ts file.

- **Data Layer**: API clients, adapters, validation
  - The data layer is found within +page.server.ts files.
  - Data for this project is provided by a supabase client. See the [Supabase Javascript Client Docs](https://supabase.com/docs/reference/javascript/start) for more detail.
  - Generally, the supabase client is accessed within the load function of +page.server.ts.
  - Promises can be returned by the load function.
  - Within the +page.svelte client, data is accessed from $props.

- **Utilities**: cross-cutting helpers, shared configuration
  - Data & variables required across the application are stored in src/lib, and imported via $lib.
  - Logging is done with pino, and preconfigured logger can be imported from $lib.

## Data Flow

What happens when a user makes a request?
- Data is loaded in the load() function in +page.server.ts file
- This data is passed to +page.svelte, which reads it from $props
- +page.svelte then creates client state with $state, and creates the DOM

How are loading states handled?
- To write data to Supabase, we use form actions. This is defined by the `actions` variable within +page.server.ts.
- See src/routes/login/+page.server.ts for an example.
- To handle loading, create a `loading` client state variable with $state. Trigger the form action that supports use:enhance.
- See src/routes/login/+page.svelte for an example of loading state via use:enhance.

## Cross-Cutting Concerns

How does authentication work?
- Currently, we support user signup via email/password, with email verification.
- Users hit the `signup` form action, which sends a verification email.
- The verification email has a link, which routes to `/auth/confirm`, where we handle authentication.

## Open Questions / TODOs
- How should we create reusable UI components?
