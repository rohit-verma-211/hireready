import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const generateResume = async ({
  resumeFile,
  selfDescription,
  jobDescription,
  template,
}) => {
  const formData = new FormData();

  formData.append("resume", resumeFile);
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);
  formData.append("template", template);

  const response = await api.post("/api/resume/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  // Download PDF
  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Resume.pdf");

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};