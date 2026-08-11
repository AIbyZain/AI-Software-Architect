import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  // Fail loud in dev rather than silently hitting a relative path.
  console.warn(
    '[api] VITE_API_URL is not set. Create a .env file from .env.example.'
  );
}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 180000 // /generate runs a full multi-agent pipeline synchronously; give it room
});

/**
 * Normalizes every failure (network, timeout, FastAPI validation 422,
 * and the backend's custom HTTPException detail shape) into one shape
 * the UI can render without knowing the origin.
 *
 * Backend custom errors (app.py) look like:
 *   { detail: { error, message, details? } }
 * FastAPI's own request-validation errors look like:
 *   { detail: [{ loc, msg, type }, ...] }
 */
function normalizeError(err) {
  if (err.code === 'ECONNABORTED') {
    return {
      status: 0,
      title: 'Request timed out',
      message:
        'The architecture generation is taking longer than expected and the request timed out client-side.',
      details: null
    };
  }

  if (!err.response) {
    return {
      status: 0,
      title: 'Cannot reach the backend',
      message:
        'No response from the API. Check that the backend is running and VITE_API_URL is correct.',
      details: null
    };
  }

  const { status, data } = err.response;
  const detail = data?.detail;

  // FastAPI native request-validation error: detail is an array
  if (Array.isArray(detail)) {
    return {
      status,
      title: 'Invalid request',
      message: detail
        .map((d) => `${d.loc?.slice(-1)[0] ?? 'field'}: ${d.msg}`)
        .join(' — '),
      details: detail
    };
  }

  // Custom HTTPException shape from app.py: { error, message, details? }
  if (detail && typeof detail === 'object') {
    return {
      status,
      title: detail.error || 'Request failed',
      message: detail.message || 'An unexpected error occurred.',
      details: detail.details || null
    };
  }

  return {
    status,
    title: 'Request failed',
    message: typeof detail === 'string' ? detail : 'An unexpected error occurred.',
    details: null
  };
}

export async function checkHealth() {
  const res = await client.get('/');
  return res.data;
}

/**
 * POST /generate
 * @param {{ projectName: string, userPrompt: string }} input
 * @returns {Promise<{ success: boolean, project_name: string, architecture: object }>}
 */
export async function generateArchitecture({ projectName, userPrompt }) {
  try {
    const res = await client.post('/generate', {
      project_name: projectName,
      user_prompt: userPrompt
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}
