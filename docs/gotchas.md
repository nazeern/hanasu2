# Gotchas & Living Notes

> Document the sharp edges so teammates avoid repeating the same mistakes.

1. The pino `logger` can be called on the client or the server. If a log is missing, it may actually be found within the browser DevTools console.
