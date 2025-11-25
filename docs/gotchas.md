# Gotchas & Living Notes

> Document the sharp edges so teammates avoid repeating the same mistakes.

1. The pino `logger` can be called on the client or the server. If a log is missing, it may actually be found within the browser DevTools console.
2. If the LSP server isn't responding to updates, or is showing stale code, use `:Mason` and update the installed servers.
3. Don't request the supabase and session vars from the `+layout.server.ts` load function. Always `locals`, which is fresh per request.
4. When logging using the `logger`, the first argument should be the object, and the second argument the string.
5. If no response from OpenAI agent, your funds ran out.
