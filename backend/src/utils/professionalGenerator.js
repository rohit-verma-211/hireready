import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

export function generateProfessionalLatex(resumeData) {
  // ⭐ Verify this path matches your actual folder structure.
  // Flat structure (utils/professionalGenerator.js + templates/professional/professional.tex) -> "../templates/..."
  // Nested structure (utils/generators/professionalGenerator.js) -> "../../templates/..."
  const templatePath = path.join(
    __dirname,
    "../templates/professional/professional.tex"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "professional" not found at ${templatePath}`);
  }

  let latex = fs.readFileSync(templatePath, "utf8");

  // ================= HEADER =================

  latex = latex.replaceAll(
    "{{NAME}}",
    escapeLatex(resumeData.personalInfo?.name || "")
  );

  latex = latex.replaceAll(
    "{{EMAIL}}",
    escapeLatex(resumeData.personalInfo?.email || "")
  );

  const linkedinLink = resumeData.personalInfo?.linkedin
    ? `\\href{${normalizeUrl(resumeData.personalInfo.linkedin)}}{LinkedIn}`
    : "";

  latex = latex.replaceAll("{{LINKEDIN_LINK}}", linkedinLink);

  // ================= EXPERIENCE =================
  // Company as header-left, duration as header-right, role as italic subtitle.

  // ================= EXPERIENCE =================

const experienceItems = (resumeData.experience || []).map((exp) => {
  return `
\\begin{joblong}{${escapeLatex(exp.company || "")}}{${escapeLatex(exp.duration || "")}}
\\textit{${escapeLatex(exp.role || "")}}\\\\[3pt]
${(exp.points || []).map((point) => `\\item ${escapeLatex(point)}`).join("\n")}
\\end{joblong}
\\vspace{3pt}
`;
}).join("\n");

// Agar experience empty hai, poora section (heading included) hata do
if ((resumeData.experience || []).length === 0) {
  latex = latex.replace(/\\section\{Experience\}\s*\{\{EXPERIENCE_SECTION\}\}/, "");
} else {
  latex = latex.replaceAll("{{EXPERIENCE_SECTION}}", experienceItems);
}

  // ================= PROJECTS =================
  // FIX: GitHub link is now a real clickable \href, not escaped raw text.

  const projectsLatex = (resumeData.projects || [])
    .map((project) => {
      const titleLine = [
        project.title,
        project.techStack ? `(${project.techStack})` : "",
      ]
        .filter(Boolean)
        .map(escapeLatex)
        .join(" ");

      const githubLink = project.github
        ? `\\href{${normalizeUrl(project.github)}}{Github}`
        : "";

      return `
\\begin{joblong}{${titleLine}}{${githubLink}}
${(project.points || [])
          .map((p) => `\\item ${escapeLatex(p)}`)
          .join("\n")}
\\end{joblong}
\\vspace{3pt}
`;
    })
    .join("\n");

  latex = latex.replaceAll("{{PROJECTS_SECTION}}", projectsLatex);

  // ================= EDUCATION =================

  const educationLatex = (resumeData.education || [])
    .map((edu) => {
      const left = escapeLatex(edu.institute || "");
      const right = escapeLatex(edu.year || "");
      const scoreLabel = edu.cgpa
        ? `CGPA: ${escapeLatex(edu.cgpa)}`
        : edu.percentage
          ? `${escapeLatex(edu.percentage)}\\%`
          : "";

      return `
\\begin{jobshort}{${left}}{${right}}
\\end{jobshort}
${escapeLatex(edu.degree || "")} \\hfill ${scoreLabel}\\\\[6pt]
`;
    })
    .join("\n");

  latex = latex.replaceAll("{{EDUCATION}}", educationLatex);

  // ================= SKILLS =================
  // Kept as bold-label + comma list (robust to variable-length lists).
  // If you want a strict two-column tabularx layout instead, flag it —
  // needs explicit column width handling so long skill lists don't overflow.

  const skills = resumeData.skills || {};

  const skillLine = (label, arr) =>
    arr && arr.length
      ? `\\textbf{${escapeLatex(label)}:} ${arr.map(escapeLatex).join(", ")} \\\\[4pt]`
      : "";

  const skillsLatex = [
    skillLine("Languages", skills.languages),
    skillLine("Frameworks", skills.frameworks),
    skillLine("Tools", skills.tools),
    skillLine("Platforms", skills.platforms),
    skillLine("Soft Skills", skills.softSkills),
  ]
    .filter(Boolean)
    .join("\n");

  latex = latex.replaceAll("{{SKILLS}}", skillsLatex);

  // ================= CERTIFICATIONS =================

  const certificationItems = (resumeData.certifications || [])
    .map(
      (cert) =>
        `\\item ${escapeLatex(cert.name)} (${escapeLatex(
          cert.provider
        )}, ${escapeLatex(cert.completionDate)})`
    )
    .join("\n");

  const certificationsLatex = certificationItems
    ? `\\begin{itemize}[nosep,leftmargin=1.2em]\n${certificationItems}\n\\end{itemize}`
    : "";

  latex = latex.replaceAll("{{CERTIFICATIONS_SECTION}}", certificationsLatex);

  // ================= ACHIEVEMENTS =================

  const achievementItems = (resumeData.achievements || [])
    .map((achievement) => `\\item ${escapeLatex(achievement)}`)
    .join("\n");

  const achievementsLatex = achievementItems
    ? `\\begin{itemize}[nosep,leftmargin=1.2em]\n${achievementItems}\n\\end{itemize}`
    : "";

  latex = latex.replaceAll("{{ACHIEVEMENTS_SECTION}}", achievementsLatex);

  // ================= POSITIONS OF RESPONSIBILITY =================

  const positionsLatex = (resumeData.positionsOfResponsibility || [])
    .map((pos) => {
      const titleLine = [pos.title, pos.organization]
        .filter(Boolean)
        .map(escapeLatex)
        .join(", ");

      return `
\\begin{joblong}{${titleLine}}{${escapeLatex(pos.duration || "")}}
${(pos.points || []).map((p) => `\\item ${escapeLatex(p)}`).join("\n")}
\\end{joblong}
\\vspace{3pt}
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

      extraSectionsLatex += `\n\\section{${escapeLatex(sectionName)}}\n`;

      section.forEach((item) => {
        if (typeof item === "string") {
          extraSectionsLatex += `\\begin{jobshort}{${escapeLatex(
            item
          )}}{}\n\\end{jobshort}\n`;
          return;
        }

        const heading = item.title || item.name || item.organization || "";
        const duration = item.duration || item.year || "";

        extraSectionsLatex += `
\\begin{joblong}{${escapeLatex(heading)}}{${escapeLatex(duration)}}
${(item.points || []).map((p) => `\\item ${escapeLatex(p)}`).join("\n")}
\\end{joblong}
\\vspace{3pt}
`;
      });
    });

  latex = latex.replaceAll("{{EXTRA_SECTIONS}}", extraSectionsLatex);

  return latex;
}