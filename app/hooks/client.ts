import type { HandleClientError } from "@sveltejs/kit";
import { handleErrorSecure } from "./handleErrorSecure.js";

export const handleError = (async (args) => {
  return await handleErrorSecure(args, async ({ error, event }) => {
    return { message: `Unexpected error when handling navigation` };
  });
}) satisfies HandleClientError;
