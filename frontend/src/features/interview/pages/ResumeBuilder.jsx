import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { generateResume } from "../services/resume.api";
import TemplateModal from "../components/TemplateModal";
import TEMPLATES from "../constants/templates";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const resumeRef = useRef(null);

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [template, setTemplate] = useState("resume");
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedTemplate = TEMPLATES.find((t) => t.id === template);

  const handleGenerateResume = async () => {
    const resumeFile = resumeRef.current.files[0];

    if (!resumeFile) {
      alert("Please upload your resume.");
      return;
    }

    try {
      setLoading(true);

      await generateResume({
        resumeFile,
        selfDescription,
        jobDescription,
        template,
      });

      alert("Resume Generated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1746003288323-89dba68721f6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat flex justify-center items-start py-12 px-4">

      <div className="w-full max-w-3xl rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-10 flex flex-col gap-6">

        <button
          onClick={() => navigate("/")}
          className="w-fit text-sm font-medium text-gray-700 hover:text-black transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          📄 AI Resume Builder
        </h1>

        <p className="text-gray-600">
          Upload your resume and generate an ATS-friendly resume optimized for your target job.
        </p>

        {/* Resume Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Upload Resume
          </label>
          <input
            ref={resumeRef}
            type="file"
            accept=".pdf"
            className="w-full rounded-2xl border border-gray-300/70 bg-white/60 px-4 py-3 text-sm text-gray-800 file:mr-4 file:rounded-full file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white file:font-medium hover:file:bg-black cursor-pointer transition-all"
          />
        </div>

        {/* Job Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full min-h-[150px] rounded-2xl border border-gray-300/70 bg-white/60 p-4 outline-none focus:border-gray-900 resize-none"
          />
        </div>

        {/* Self Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Self Description
          </label>
          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            placeholder="Tell us something about yourself..."
            className="w-full min-h-[150px] rounded-2xl border border-gray-300/70 bg-white/60 p-4 outline-none focus:border-gray-900 resize-none"
          />
        </div>

        {/* Template Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Resume Template
          </label>
          <button
            type="button"
            onClick={() => setShowTemplates(true)}
            className="rounded-2xl border border-gray-300 bg-white p-4 flex items-center gap-4 hover:border-blue-500 transition cursor-pointer"
          >
            <img
              src={selectedTemplate.preview}
              alt={selectedTemplate.label}
              className="w-20 h-28 rounded-lg border object-cover object-top"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{selectedTemplate.label}</h3>
              <p className="text-sm text-gray-500">Click to change template</p>
            </div>
          </button>
        </div>

        {/* Selected Template Summary */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Selected Template</p>
            <p className="font-semibold text-gray-900">{selectedTemplate.label}</p>
          </div>
          <img
            src={selectedTemplate.preview}
            alt={selectedTemplate.label}
            className="w-14 rounded border object-cover object-top"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateResume}
          disabled={loading}
          className="w-full sm:w-auto sm:self-end rounded-full bg-gray-900 hover:bg-black disabled:opacity-60 text-white font-medium px-8 py-3.5 shadow-lg transition-all active:scale-[0.98]"
        >
          {loading ? "Generating..." : "Generate ATS Resume"}
        </button>

      </div>

      <TemplateModal
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
        template={template}
        setTemplate={setTemplate}
        templates={TEMPLATES}
      />

    </main>
  );
};

export default ResumeBuilder;