import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// 1️⃣ Fetch GitHub repo files
export const fetchRepo = async (repoUrl) => {
  const response = await axios.get(`${API_BASE}/fetch-repo`, {
    params: { repo_url: repoUrl },
  });
  return response.data;
};

// 2️⃣ Generate documentation
export const generateDocs = async (files) => {
  const response = await axios.post(`${API_BASE}/generate-docs`, { files });
  return response.data;
};

// 3️⃣ Export documentation (PDF/DOCX)
export const exportDocs = async (format = "pdf", files = []) => {
  const response = await axios.post(
    `${API_BASE}/export-docs?format=${format}`,
    { files },
    { responseType: "blob" }
  );
  return response;
};
