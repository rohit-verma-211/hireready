import pdfParse from "pdf-parse/lib/pdf-parse.js";
import generateInterviewReport from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

async function generateInterViewReportController(req, res) {

    try {
        const resumeFile = req.file;

        const pdfData = await pdfParse(resumeFile.buffer);
        const resume = pdfData.text;

        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId , user: req.user.id   });
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }
        return res.status(200).json({ 
            message: "Interview report fetched successfully",
            interviewReport });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}



async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = (await interviewReportModel.find({ user: req.user.id })).toSorted({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan  ");
        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}

export {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
};