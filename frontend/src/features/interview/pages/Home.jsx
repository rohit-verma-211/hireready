import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useinterview.js";
import { useNavigate } from "react-router";

export const Home = () => {
  const { loading, generateReport } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const resumeInputRef = useRef(null);

  const navigate = useNavigate();

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

  if(loading ){
    return <main><h1>Generating Interview Report...</h1></main> 
  }

  return (
    <main className="home">
      <div className="left">
        <p className="panel-label">Job Description</p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          name="jobDescription"
          id="jobDescription"
          placeholder="Enter job description here..."
        />
      </div>

      <div className="right">
        <p className="panel-label">Your Profile</p>

        <div className="input-group">
          <label htmlFor="resume">Upload Resume</label>

          <input
            ref={resumeInputRef}
            type="file"
            name="resume"
            id="resume"
            accept=".pdf"
          />
        </div>

        <div className="input-group">
          <label htmlFor="selfDescription">Self Description</label>

          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            name="selfDescription"
            id="selfDescription"
            placeholder="Describe yourself in a few sentences..."
          />
        </div>

        <button
          className="generate-btn"
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Interview Report"}
        </button>
      </div>
    </main>
  );
};

export default Home;