import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateResumeData({
  resume,
  jobDescription,
  selfDescription,
}) {
  try {
    console.log("✅ Entered generateResumeData");

    const prompt = `
You are an expert ATS Resume Writer and Recruiter.

Analyze the candidate's resume and optimize it according to the given job description.

Rules:

1. Never invent fake experience.
2. Never invent fake education.
3. Improve existing bullet points using strong action verbs.
4. Add ATS keywords naturally from the job description.
5. Keep all information truthful.
6. Return ONLY valid JSON.
7. Do NOT return markdown.y

8. Do NOT return explanations.
9.Never throw an error if any section is missing.
If a section does not exist in the resume, simply return an empty string "" or an empty array [] for that section.
The JSON must always remain valid.
10. Keep exactly the same JSON structure.
11. For education, always extract institute, location, degree, cgpa and year separately.
12. Categorize all skills into:
- languages
- frameworks
- tools
- platforms
- softSkills
13.Return every section completely populated.
Do not leave any array empty if information exists in the resume.
14.Project Rules:

- Keep the original project title.
- Keep the original tech stack.
- Improve existing bullet points using ATS keywords.
- Never invent fake projects.
- Return exactly 3-5 bullet points for every project.
- Return the tech stack separately in the "techStack" field.
15.Certification Rules:

- Keep only certifications present in the resume.
- Do not invent certifications.
- Preserve certification names.
- Include certification provider if available.
- Include completion month/year if available.

16.Achievement Rules:

- Keep only achievements present in the resume.
- Do not invent achievements.
- Improve wording using strong action verbs.
- Preserve rankings, awards and numbers exactly.

17.Positions of Responsibility Rules:

- Keep only positions mentioned in the resume.
- Do not invent leadership roles.
- Preserve organization name.
- Preserve duration.
- Rewrite responsibilities using ATS keywords.
- Return 2-5 bullet points for each position.
18.Return every section completely populated whenever the information exists in the resume.

Never leave education, experience, projects, skills, certifications, achievements, or positionsOfResponsibility empty if the resume contains that information.


19.Always populate Soft Skills if they are present in the resume.

20. The final resume MUST fit on exactly ONE PAGE.
- Shorten bullet points if necessary.
- Use concise ATS-friendly language.
- Keep each bullet under 20 words whenever possible.
- Maximum:
  - Experience: 3 bullets each
  - Projects: 3 bullets each
  - Positions: 2 bullets each
- Do not overflow to a second page.
21. Preserve every relevant section found in the candidate's resume.
22. If the resume contains a section that is NOT present in the predefined schema, automatically create a new top-level JSON key using the same section title and populate it.

Examples:
- publications
- researchExperience
- volunteerExperience
- hackathons
- patents
- awards
- conferences
- openSource
- training
- workshops
- leadership
- interests


Return JSON exactly like this:

  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },

  "education": [
  {
    "institute": "",
    "location": "",
    "degree": "",
    "cgpa": "",
    "year": ""
  }
],

  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "location": "",
      "points": [
        "",
        "",
        ""
      ]
    }
  ],

  "projects": [
    {
      "title": "",
      "techStack": "",
      "points": [
        "",
        "",
        ""
      ]
    }
  ],

  "skills": {
  "languages": [],
  "frameworks": [],
  "tools": [],
  "platforms": [],
  "softSkills": []
},

  "certifications": [],

  "achievements": [],

  "positionsOfResponsibility": [
    {
      "title": "",
      "organization": "",
      "duration": "",
      "points": [
        "",
        ""
      ]
    }
  ],
  "publications": [
  {
    "title": "",
    "conference": "",
    "year": ""
  }
],

"researchExperience": [
  {
    "organization": "",
    "duration": "",
    "points": []
  }
],

"volunteerExperience": [
  {
    "organization": "",
    "role": "",
    "duration": "",
    "points": []
  }
],

"hackathons": [
  {
    "name": "",
    "year": "",
    "achievement": ""
  }
],

"patents": [
  {
    "title": "",
    "number": "",
    "year": ""
  }
]


}

==========================
CURRENT RESUME
==========================

${resume}

==========================
JOB DESCRIPTION
==========================

${jobDescription}

==========================
SELF DESCRIPTION
==========================

${selfDescription}
`;

    console.log("🚀 Calling Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    console.log("✅ Gemini Response Received");
    console.log("========== GEMINI JSON ==========");
    console.log(response.text);

    const resumeData = JSON.parse(response.text);

    return resumeData;
  } catch (err) {
    console.error("❌ Resume AI Error:", err);
    throw err;
  }
}