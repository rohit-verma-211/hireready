import React, { useState, useRef, useEffect } from "react";
import { useInterview } from "../hooks/useinterview.js";
import { useNavigate } from "react-router";

export const InterviewForm = () => {
  const {
    loading,
    generateReport,
    reports,
    getReports,
  } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const resumeFile = resumeInputRef.current.files[0];

      if (!resumeFile) {
        alert("Please upload your resume.");
        return;
      }

      const data = await generateReport({
        resumeFile,
        selfDescription,
        jobDescription,
      });

      navigate(`/interview/${data._id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate interview report.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1746003288323-89dba68721f6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <h1 className="text-lg font-semibold text-gray-700">Analysing...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-sky-100 via-white to-blue-100 flex flex-col gap-8">

      {/* Job Description + Your Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left — Job Description */}
        <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-8 flex flex-col gap-4">
          <p className="text-lg font-semibold text-gray-900 tracking-tight">Job Description</p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            name="jobDescription"
            id="jobDescription"
            placeholder="Enter job description here..."
            className="flex-1 min-h-[300px] w-full rounded-2xl border border-gray-300/70 bg-white/60 backdrop-blur-sm p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Right — Your Profile */}
        <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-8 flex flex-col gap-6">
          <p className="text-lg font-semibold text-gray-900 tracking-tight">Your Profile</p>

          <div className="flex flex-col gap-2">
            <label htmlFor="resume" className="text-sm font-semibold text-gray-800">Upload Resume</label>
            <input
              ref={resumeInputRef}
              type="file"
              name="resume"
              id="resume"
              accept=".pdf"
              className="w-full rounded-2xl border border-gray-300/70 bg-white/60 px-4 py-3 text-sm text-gray-800 file:mr-4 file:rounded-full file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white file:font-medium hover:file:bg-black cursor-pointer transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="selfDescription" className="text-sm font-semibold text-gray-800">Self Description</label>
            <textarea
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              name="selfDescription"
              id="selfDescription"
              placeholder="Describe yourself in a few sentences..."
              className="w-full min-h-[160px] rounded-2xl border border-gray-300/70 bg-white/60 backdrop-blur-sm p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="mt-auto w-full rounded-full bg-gray-900 hover:bg-black text-white font-medium py-3.5 shadow-lg shadow-gray-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Generating..." : "Generate Interview Report"}
          </button>
        </div>
      </div>

      {/* Previous Reports */}
      <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-8 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Previous Reports</h2>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report._id}
                onClick={() => navigate(`/interview/${report._id}`)}
                className="border border-white/60 bg-white/50 rounded-2xl px-4 py-3 cursor-pointer hover:bg-white/80 hover:border-gray-300 hover:-translate-y-0.5 transition-all"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {report.title ||
                    report.jobDescription?.split("\n")[0] ||
                    "Interview Preparation Report"}
                </h3>
                <p className="text-xs text-gray-400">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <span className="text-3xl">📋</span>
            <p className="text-sm text-gray-400">No previous reports found.</p>
          </div>
        )}
      </div>

    </main>
  );
};

export default InterviewForm;