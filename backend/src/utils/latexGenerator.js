import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateProfessionalLatex } from "./professionalGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function escapeLatex(text = "") {
  return String(text)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}");
}

export function normalizeUrl(url = "") {
  if (!url) return "";

  url = url.trim();

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }

  return `https://${url}`;
}

export function generateLatex(resumeData, template = "resume") {
  // ===== Professional template: delegate entirely =====
  if (template === "professional") {
    return generateProfessionalLatex(resumeData);
  }

  console.log("===== INSIDE GENERATE LATEX =====");
  console.log(JSON.stringify(resumeData, null, 2));

  console.log("NAME =", resumeData.personalInfo?.name);
  console.log("EMAIL =", resumeData.personalInfo?.email);

  const templatePath = path.join(
    __dirname,
    "../templates",
    template,
    `${template}.tex`
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${template}" not found.`);
  }

  let latex = fs.readFileSync(templatePath, "utf8");

  const isModern = template === "modern";

  // ================= HEADER =================

  latex = latex.replaceAll(
    "{{NAME}}",
    escapeLatex(resumeData.personalInfo?.name || "")
  );

  latex = latex.replaceAll(
    "{{EMAIL}}",
    escapeLatex(resumeData.personalInfo?.email || "")
  );

  // Change 1: PHONE removed

  // Change 2: Improved branch extraction (modern only)
  if (isModern) {
    const education = resumeData.education?.[0] || {};

    let degree = education.degree || "";
    let branch = "";

    const patterns = [
      {
        regex: /^Bachelor of Technology\s+in\s+(.+)$/i,
        degree: "Bachelor of Technology",
      },
      {
        regex: /^Bachelor of Engineering\s+in\s+(.+)$/i,
        degree: "Bachelor of Engineering",
      },
      {
        regex: /^Master of Technology\s+in\s+(.+)$/i,
        degree: "Master of Technology",
      },
      {
        regex: /^B\.?Tech\s+(.+)$/i,
        degree: "B.Tech",
      },
      {
        regex: /^B\.?E\.?\s+(.+)$/i,
        degree: "B.E.",
      },
      {
        regex: /^M\.?Tech\s+(.+)$/i,
        degree: "M.Tech",
      },
    ];

    for (const p of patterns) {
      const match = degree.match(p.regex);
      if (match) {
        degree = p.degree;
        branch = match[1].trim();
        break;
      }
    }

    latex = latex.replaceAll("{{DEGREE}}", escapeLatex(degree));
    latex = latex.replaceAll("{{BRANCH}}", escapeLatex(branch));
    latex = latex.replaceAll("{{COLLEGE}}", escapeLatex(education.institute || ""));
  }

  // Change 3: LinkedIn empty string when not present
  const linkedinLink = resumeData.personalInfo?.linkedin
    ? `\\href{${normalizeUrl(resumeData.personalInfo.linkedin)}}{LinkedIn}`
    : "";

  latex = latex.replaceAll("{{LINKEDIN_LINK}}", linkedinLink);

  // ================= EDUCATION =================

  const educationLatex = (resumeData.education || [])
    .map(
      (edu) => `
\\resumeSubheading
{${escapeLatex(edu.institute)}}
{${escapeLatex(edu.location || "")}}
{${escapeLatex(edu.degree)}; CGPA: ${escapeLatex(edu.cgpa)}}
{${escapeLatex(edu.year)}}
`
    )
    .join("\n");

  latex = latex.replaceAll("{{EDUCATION}}", educationLatex);

  // ================= EDUCATION TABLE (modern only) =================
  if (isModern) {
    const educationTableLatex = (resumeData.education || [])
      .map((edu) => {
        const score = edu.cgpa
          ? escapeLatex(edu.cgpa)
          : escapeLatex(edu.percentage || "");

        return `${escapeLatex(edu.year)} &\n${escapeLatex(edu.degree)} &\n${escapeLatex(edu.institute)} &\n${score} \\\\\n\\hline`;
      })
      .join("\n");

    latex = latex.replaceAll("{{EDUCATION_TABLE}}", educationTableLatex);
  }

  // ================= SKILLS =================

  const skills = resumeData.skills || {};

  const skillsLatex = `
\\resumeSubItem{Languages}{~~~~~~${(skills.languages || []).map(escapeLatex).join(", ")}
}
\\resumeSubItem{Frameworks}{~~~~${(skills.frameworks || []).map(escapeLatex).join(", ")}
}
\\resumeSubItem{Tools}{~~~~~~~~~~~~${(skills.tools || []).map(escapeLatex).join(", ")}
}
\\resumeSubItem{Platforms}{~~~~~~~${(skills.platforms || []).map(escapeLatex).join(", ")}
}
\\resumeSubItem{Soft Skills}{~~~~~~~${(skills.softSkills || []).map(escapeLatex).join(", ")}
}
`;

  latex = latex.replaceAll("{{SKILLS}}", skillsLatex);

  // ================= EXPERIENCE =================

  const experienceLatex = (resumeData.experience || [])
    .map((exp) => {
      return `
\\resumeSubheading
{${escapeLatex(exp.company)}}
{${escapeLatex(exp.location)}}
{${escapeLatex(exp.role)}}
{${escapeLatex(exp.duration)}}

\\resumeItemListStart
${(exp.points || [])
          .map((point) => `\\item ${escapeLatex(point)}`)
          .join("\n")}
\\resumeItemListEnd

\\vspace{-5pt}
`;
    })
    .join("\n");

  latex = latex.replaceAll("{{EXPERIENCE_SECTION}}", experienceLatex);

  // ================= PROJECTS =================

  const projectsLatex = (resumeData.projects || [])
    .map((project) => {
      if (isModern) {
        return `
\\resumeProject
{${escapeLatex(project.title)}}
{${escapeLatex(project.techStack || "")}}
{${escapeLatex(project.duration || "")}}
{${project.github ? `\\href{${normalizeUrl(project.github)}}{\\textbf{Github}}` : ""}}

\\resumeItemListStart
${(project.points || []).map(p => `\\item ${escapeLatex(p)}`).join("\n")}
\\resumeItemListEnd
`;
      }

      return `
\\resumeSubheading
{${escapeLatex(project.title)}}
{}
{Tech: ${escapeLatex(project.techStack)}}
{}

\\resumeItemListStart
${(project.points || []).map(p => `\\item ${escapeLatex(p)}`).join("\n")}
\\resumeItemListEnd

\\vspace{-5pt}
`;
    })
    .join("\n");

  latex = latex.replaceAll("{{PROJECTS_SECTION}}", projectsLatex);

  // ================= CERTIFICATIONS =================

  const certificationsLatex = (resumeData.certifications || [])
    .map(
      (cert) =>
        `\\item ${escapeLatex(cert.name)} (${escapeLatex(cert.provider)}, ${escapeLatex(cert.completionDate)})`
    )
    .join("\n");

  latex = latex.replaceAll("{{CERTIFICATIONS_SECTION}}", certificationsLatex);

  // ================= ACHIEVEMENTS =================

  const achievementsLatex = (resumeData.achievements || [])
    .map(achievement => `\\item ${escapeLatex(achievement)}`)
    .join("\n");

  latex = latex.replaceAll("{{ACHIEVEMENTS_SECTION}}", achievementsLatex);

  // ================= POSITIONS OF RESPONSIBILITY =================

  const positionsLatex = (resumeData.positionsOfResponsibility || [])
    .map(pos => {
      if (isModern) {
        return `
\\resumePOR
{${escapeLatex(pos.title)}}
{${escapeLatex(pos.organization)}}
{${escapeLatex(pos.duration)}}
`;
      }

      return `
\\resumeSubheading
{${escapeLatex(pos.title)}}
{}
{${escapeLatex(pos.organization)}}
{${escapeLatex(pos.duration)}}

\\resumeItemListStart
${(pos.points || []).map(p => `\\item ${escapeLatex(p)}`).join("\n")}
\\resumeItemListEnd
`;
    })
    .join("\n");

  latex = latex.replaceAll("{{POSITIONS_SECTION}}", positionsLatex);

  // ================= EXTRA SECTIONS =================

  const standardSections = [
    "personalInfo",
    "education",
    "experience",
    "projects",
    "skills",
    "certifications",
    "achievements",
    "positionsOfResponsibility",
    "publications",
    "researchExperience",
    "volunteerExperience",
    "hackathons",
    "patents",
  ];

  let extraSectionsLatex = "";

  Object.keys(resumeData)
    .filter((key) => !standardSections.includes(key))
    .forEach((sectionName) => {
      const section = resumeData[sectionName];

      if (!Array.isArray(section) || section.length === 0) return;

      extraSectionsLatex += `
\\vspace{-5pt}
\\section{${escapeLatex(sectionName)}}
\\resumeSubHeadingListStart
`;

      section.forEach((item) => {
        if (typeof item === "string") {
          extraSectionsLatex += `
\\resumeSubheading
{${escapeLatex(item)}}
{}
{}
{}
`;
        } else {
          const heading =
            item.title ||
            item.name ||
            item.organization ||
            "";

          const subHeading =
            item.role ||
            item.conference ||
            item.achievement ||
            "";

          const duration =
            item.duration ||
            item.year ||
            "";

          extraSectionsLatex += `
\\resumeSubheading
{${escapeLatex(heading)}}
{}
{${escapeLatex(subHeading)}}
{${escapeLatex(duration)}}
`;

          if (Array.isArray(item.points) && item.points.length) {
            extraSectionsLatex += `
\\resumeItemListStart
${item.points
                .map((p) => `\\item ${escapeLatex(p)}`)
                .join("\n")}
\\resumeItemListEnd
`;
          }
        }
      });

      extraSectionsLatex += `
\\resumeSubHeadingListEnd
`;
    });

  latex = latex.replaceAll("{{EXTRA_SECTIONS}}", extraSectionsLatex);

  return latex;
}