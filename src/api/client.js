// Centralized API configuration. Every request in the app is built from
// this single base URL, so switching between local development and a
// deployed backend only ever requires changing VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL;

console.log("VITE_API_URL:", API_URL);

if (!API_URL) {
  throw new Error("VITE_API_URL is missing");
}

export const API_BASE_URL = API_URL.replace(/\/+$/, "");

/**
 * A normalized error thrown for any non-2xx API response.
 * `status` mirrors the HTTP status code so the UI can map it to a
 * human-readable message without inspecting response internals.
 */
export class ApiError extends Error {
  constructor(status, message, detail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

// Maps the backend's documented error responses (422 / 500 / 503 / 504)
// plus generic network failure to a technical, human-readable message.
// This never surfaces stack traces or raw backend payloads to the user.
export function messageForStatus(status, fallbackDetail) {
  switch (status) {
    case 422:
      return "Please provide a more detailed project description.";
    case 500:
      return "Architecture generation failed. Please try again.";
    case 503:
      return "AI service connection failed. Please try again.";
    case 504:
      return "Architecture generation timed out. Please try again.";
    case 404:
      return fallbackDetail || "The requested resource was not found.";
    case 0:
      return "Could not reach the architecture service. Check your connection and the API URL.";
    default:
      return fallbackDetail || "Something went wrong. Please try again.";
  }
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Thin fetch wrapper. Throws ApiError for non-2xx responses and for
 * network-level failures (status 0), so callers only handle one path.
 */
export async function apiFetch(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
  } catch {
    throw new ApiError(0, messageForStatus(0));
  }

  if (!response.ok) {
    const body = await parseJsonSafely(response);
    const detail =
      (body && body.detail && (body.detail.message || body.detail)) ||
      undefined;
    throw new ApiError(
      response.status,
      messageForStatus(response.status, typeof detail === "string" ? detail : undefined),
      body?.detail
    );
  }

  return response;
}
