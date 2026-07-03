import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { generatePdf } from "../utils/pdfGenerator.js";
import { generateResumeData } from "../services/resume.ai.service.js";
import { generateLatex } from "../utils/latexGenerator.js";

export async function generateResumeController(req, res) {
  try {
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        message: "Resume is required",
      });
    }

    const pdfData = await pdfParse(resumeFile.buffer);
    const resume = pdfData.text;

    const {
      jobDescription,
      selfDescription,
      template,
    } = req.body;

    console.log("========== RESUME ==========");
    console.log(resume);

    console.log("========== JOB DESCRIPTION ==========");
    console.log(jobDescription);

    console.log("========== SELF DESCRIPTION ==========");
    console.log(selfDescription);

    console.log("========== TEMPLATE ==========");
    console.log(template);

    const resumeData = await generateResumeData({
      resume,
      jobDescription,
      selfDescription,
    });

    console.log("========== GENERATED RESUME DATA ==========");
    console.log(resumeData);

    const latex = generateLatex(
      resumeData,
      template || "resume"
    );

    console.log("========== GENERATED LATEX ==========");
    console.log(latex);

    const pdfPath = await generatePdf(latex);

    return res.download(pdfPath, "Resume.pdf");

  } catch (err) {
    console.error("Resume Generation Error:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
}