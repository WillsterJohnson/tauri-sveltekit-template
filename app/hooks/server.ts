import type { Handle, HandleServerError, HandleFetch } from "@sveltejs/kit";
import { handleErrorSecure } from "./handleErrorSecure.js";

export const handle = (async ({ event, resolve }) => {
  const response = await resolve(event);
  return response;
}) satisfies Handle;

export const handleError = (async (args) => {
  return await handleErrorSecure(args, async ({ error, event }) => {
    return { message: `Unexpected error when handling request` };
  });
}) satisfies HandleServerError;

export const handleFetch = (async ({ request, fetch }) => {
  return fetch(request);
}) satisfies HandleFetch;
