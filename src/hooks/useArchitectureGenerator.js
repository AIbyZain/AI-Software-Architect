import { useCallback, useState } from "react";
import { generateArchitecture } from "../api/architect";

// status: "idle" | "loading" | "success" | "error"
export function useArchitectureGenerator() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = useCallback(async ({ projectName, description }) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await generateArchitecture({ projectName, description });
      setResult(data);
      setStatus("success");
      return data;
    } catch (err) {
      setError(err.message || "Architecture generation failed. Please try again.");
      setStatus("error");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, generate, reset };
}
