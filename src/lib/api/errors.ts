import type { ApiClientError, ApiErrorReason } from "./types";

/** Classify an HTTP response into a structured client error. */
export function classifyError(
  status: number,
  code?: string,
  message?: string,
  details?: Record<string, string[]>
): ApiClientError {
  let reason: ApiErrorReason = "unknown";

  switch (status) {
    case 401:
      reason = "unauthorized";
      break;
    case 403:
      reason = "forbidden";
      break;
    case 404:
      reason = "not-found";
      break;
    case 409:
      reason = "conflict";
      break;
    case 422:
      reason = "validation";
      break;
    case 429:
      reason = "rate-limited";
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      reason = "server";
      break;
    default:
      if (status >= 400 && status < 500) reason = "validation";
      else if (status >= 500) reason = "server";
  }

  return {
    reason,
    status,
    code,
    message: message ?? `Request failed with HTTP ${status}`,
    ...(details ? { details } : {}),
  };
}

/** Create a network failure error. */
export function networkError(): ApiClientError {
  return {
    reason: "network",
    message: "Network error. Please check your connection and try again.",
  };
}

/** Create a timeout error. */
export function timeoutError(): ApiClientError {
  return {
    reason: "timeout",
    message: "The request timed out. Please try again.",
  };
}

/** Create a not-configured error. */
export function notConfiguredError(): ApiClientError {
  return {
    reason: "not-configured",
    message:
      "The community API is not configured on this site yet. Please try again later or contact the Code Yaar team.",
  };
}

/** Extract a user-readable message from an API error response body. */
export function extractErrorMessage(body: unknown): string {
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    (body as { error?: unknown }).error &&
    typeof (body as { error: { message?: unknown } }).error === "object"
  ) {
    const msg = (body as { error: { message?: unknown } }).error.message;
    if (typeof msg === "string" && msg.trim()) return msg.trim();
  }
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
  ) {
    return (body as { message: string }).message.trim();
  }
  return "An unexpected error occurred.";
}
