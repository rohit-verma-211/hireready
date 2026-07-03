import pdfParse from "pdf-parse/lib/pdf-parse.js";
import generateInterviewReport from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

// Generate Interview Report
async function generateInterViewReportController(req, res) {
    try {
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({
                message: "Resume file is required",
            });
        }

        const pdfData = await pdfParse(resumeFile.buffer);
        const resume = pdfData.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message,
        });
    }
}

// Get Single Report
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id,
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found",
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message,
        });
    }
}

// Get All Reports
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select(
                "-resume -selfDescription  -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
            );

        return res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports,
        });
    } catch (err) {
        console.error(err);
        console.error(err.stack);

        return res.status(500).json({
            message: err.message,
        });
    }
}

export {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
};