import { useCallback, useState } from "react";
import { fetchReports, downloadReportsZip } from "../api/architect";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [listStatus, setListStatus] = useState("idle"); // idle | loading | success | error
  const [listError, setListError] = useState(null);

  const [downloadStatus, setDownloadStatus] = useState("idle"); // idle | loading | success | error
  const [downloadError, setDownloadError] = useState(null);

  const loadReports = useCallback(async () => {
    setListStatus("loading");
    setListError(null);
    try {
      const data = await fetchReports();
      setReports(data.reports || []);
      setListStatus("success");
    } catch (err) {
      // A 404 here just means no reports directory exists yet — treat
      // that as an empty list rather than a hard error.
      if (err.status === 404) {
        setReports([]);
        setListStatus("success");
        return;
      }
      setListError(err.message || "Could not load reports.");
      setListStatus("error");
    }
  }, []);

  const downloadAll = useCallback(async () => {
    setDownloadStatus("loading");
    setDownloadError(null);
    try {
      const { blob, filename } = await downloadReportsZip();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadStatus("success");
    } catch (err) {
      setDownloadError(err.message || "Failed to create reports ZIP file.");
      setDownloadStatus("error");
    }
  }, []);

  return {
    reports,
    listStatus,
    listError,
    loadReports,
    downloadStatus,
    downloadError,
    downloadAll,
  };
}
