import { apiFetch, ApiError, messageForStatus } from "./client";

// POST /generate
// Body: { project_name: string (min 4 chars), user_prompt: string (min 15 chars) }
// Response: { success, project_name, architecture }
export async function generateArchitecture({ projectName, description }) {
  const response = await apiFetch("/generate", {
    method: "POST",
    body: JSON.stringify({
      project_name: projectName,
      user_prompt: description,
    }),
  });
  return response.json();
}

// GET /reports
// Response: { success, count, reports: string[] }
export async function fetchReports() {
  const response = await apiFetch("/reports");
  return response.json();
}

// GET /reports/download
// Response: application/zip binary stream. Returns the blob plus the
// filename the backend set, falling back to the documented default name.
export async function downloadReportsZip() {
  const response = await apiFetch("/reports/download");
  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] || "AI_Software_Architect_Reports.zip";
  return { blob, filename };
}

export { ApiError, messageForStatus };
