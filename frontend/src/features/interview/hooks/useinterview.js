import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
} from "../services/interview.api.js";

import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
  } = context;

  const generateReport = async ({
    resumeFile,
    selfDescription,
    jobDescription,
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        resumeFile,
        selfDescription,
        jobDescription,
      });

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
  };
};