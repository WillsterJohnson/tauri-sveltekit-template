import type { MaybePromise } from "$app/forms";
import type { HandleClientError, HandleServerError } from "@sveltejs/kit";

export async function handleErrorSecure<
  T extends Parameters<HandleServerError>[0] | Parameters<HandleClientError>[0],
>(args: T, callback: (arg: T) => MaybePromise<void | App.Error>): Promise<void | App.Error> {
  try {
    return await callback(args);
  } catch (e) {
    if (e && typeof e === "object" && "message" in e)
      return { message: `Unexpected error when handling error: ${e.message}` };
    return { message: `Unexpected error when handling error: <unknown>` };
  }
}
