import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

console.log("GOOGLE_API_KEY =", process.env.GOOGLE_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .describe(
            "A score between 0 and 100 indicating how well the candidate matches the job requirements."
        ),

    technicalQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The technical question asked during the interview."),
                intention: z
                    .string()
                    .describe(
                        "The intention behind the question, e.g., to assess problem-solving skills."
                    ),
                answer: z
                    .string()
                    .describe(
                        "The candidate's answer to the technical question."
                    ),
            })
        )
        .describe("List of technical questions and answers."),

    behavioralQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The behavioral question asked during the interview."),
                intention: z
                    .string()
                    .describe(
                        "The intention behind the question, e.g., to assess cultural fit."
                    ),
                answer: z
                    .string()
                    .describe(
                        "The candidate's answer to the behavioral question."
                    ),
            })
        )
        .describe("List of behavioral questions and answers."),

    skillGaps: z
        .array(
            z.object({
                skill: z
                    .string()
                    .describe("The skill that the candidate is lacking."),
                severity: z
                    .enum(["low", "medium", "high"])
                    .describe("The severity of the skill gap."),
            })
        )
        .describe("List of skill gaps identified during the interview."),

    preparationPlan: z
        .array(
            z.object({
                day: z
                    .number()
                    .describe("The day number in the preparation plan."),
                focus: z
                    .string()
                    .describe(
                        "The focus area for the day, e.g., a specific skill or topic."
                    ),
                tasks: z
                    .array(z.string())
                    .describe(
                        "List of tasks or exercises to be completed on that day."
                    ),

            })

        )
        .describe(
            "A day-wise preparation plan for the candidate to improve their skills."
        ),

    title: z.string().describe("The title of the interview report."),    

});


async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {
    try {
        const prompt = `
You are an experienced Senior Software Engineering Interviewer and Technical Recruiter.

Your task is to analyze the candidate's profile and generate a realistic interview preparation report.

==========================
CANDIDATE RESUME
==========================
${resume}

==========================
SELF DESCRIPTION
==========================
${selfDescription}

==========================
JOB DESCRIPTION
==========================
${jobDescription}

Analyze the candidate carefully.

Generate:

1. A matchScore between 0 and 100.

2. Exactly 5 Technical Interview Questions.
For each question provide:
- question
- intention
- ideal answer

3. Exactly 5 Behavioral Interview Questions.
For each question provide:
- question
- intention
- ideal answer

4. At least 5 Skill Gaps.

For each skill gap provide:
- skill
- severity

Severity must only be:
- low
- medium
- high

5. A detailed 7-day preparation plan.

Each day must contain:
- day
- focus
- tasks (array of strings)

Return ONLY valid JSON.

DO NOT write explanations.

DO NOT write markdown.

DO NOT wrap the JSON inside \`\`\`.

Return EXACTLY this structure:

{
  "matchScore": 85,

  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "skillGaps": [
    {
      "skill": "",
      "severity": "medium"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": [
        "",
        ""
      ]
    }
  ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                
            },
        });
        console.log("====================");
        console.log(response.text);
        
        console.log("====================");
        const report = JSON.parse(response.text);
        console.log(JSON.stringify(report, null, 2));
        return report;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}

export default generateInterviewReport;