import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useInterview } from '../hooks/useinterview.js';
import {
  Code2,
  Brain,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';

const DIFFICULTY_COLOR = {
  Easy: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Hard: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

const SEVERITY_COLOR = {
  low: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  high: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions', Icon: Code2 },
  { id: 'behavioral', label: 'Behavioral Questions', Icon: Brain },
  { id: 'roadmap', label: 'Road Map', Icon: MapIcon },
];

const STRENGTHS = [
  'React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT Auth', 'Git',
];

export const Interview = () => {
  const { interviewId } = useParams();
  const { report, getReportById, loading } = useInterview();

  const [activeSection, setActiveSection] = useState('technical');
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const toggleQ = (id) => setExpandedQ(expandedQ === id ? null : id);

  if (loading || !report) {
    return (
      <div
        data-testid="interview-loading"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <h2 className="text-lg font-medium text-slate-600">Loading...</h2>
      </div>
    );
  }

  if (!loading && !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-lg font-medium text-slate-600">Report not found.</h2>
      </div>
    );
  }

  return (
    <div
      data-testid="interview-page"
      className="min-h-screen bg-[url('https://images.unsplash.com/photo-1746003288323-89dba68721f6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat"
    >
      {/* Header */}
      <header
        data-testid="interview-header"
        className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col">
            <span
              data-testid="header-role"
              className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900"
            >
              {report.role}
            </span>
            <svg
            data-testid="brand-logo"
            onClick={() => navigate("/")}
            className="h-18 w-auto cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 100"
          >
            <defs>
              <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Main Grid Background Elements */}
            <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.1" />
            {/* Left Column of H (Neural Path) */}
            <rect x="26" y="24" width="8" height="52" rx="4" fill="url(#primaryGrad)" />
            <circle cx="30" cy="34" r="2" fill="#ffffff" />
            <circle cx="30" cy="50" r="2" fill="#ffffff" opacity="0.6" />
            <circle cx="30" cy="66" r="2" fill="#ffffff" />
            {/* Left Nodes */}
            <circle cx="16" cy="42" r="3" fill="#06b6d4" />
            <circle cx="16" cy="58" r="3" fill="#3b82f6" />
            {/* Center Bridge */}
            <path d="M 34,50 L 52,50" stroke="url(#primaryGrad)" strokeWidth="8" strokeLinecap="round" />
            {/* Right Column of H / Ready Checkmark */}
            <path d="M 46,45 L 56,69 L 82,21" fill="none" stroke="url(#accentGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 46,45 L 56,69 L 82,21" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            {/* Floating AI Details */}
            <circle cx="85" cy="48" r="2.5" fill="#06b6d4" opacity="0.8" />
            {/* Brand Typography */}
            <g transform="translate(104, 0)">
              <text x="0" y="58" textAnchor="start" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="800" fill="#0441b3">
                Hire<tspan fill="url(#textGrad)" fontWeight="900">Ready</tspan>
              </text>
            </g>
          </svg>
          </div>

          <div data-testid="header-score" className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl pl-4 pr-5 py-2.5 shadow-sm w-full md:w-auto">
            <div className="relative h-16 w-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#eef2ff" strokeWidth="6" />
                <circle
                  data-testid="score-fill"
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 - (report.matchScore / 100) * (2 * Math.PI * 26)}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              <span data-testid="score-value" className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-600">
                {report.matchScore}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-slate-400">Match Score</span>
              <span className="text-sm font-medium text-slate-700">
                {report.matchScore >= 80 ? 'Strong fit' : report.matchScore >= 60 ? 'Good fit' : 'Needs work'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px] gap-6">

        {/* Sidebar Nav */}
        <nav
          data-testid="interview-nav"
          className="lg:sticky lg:top-28 self-start bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Sections
          </p>
          <ul className="space-y-1.5">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = activeSection === id;
              return (
                <li key={id}>
                  <button
                    data-testid={`nav-${id}`}
                    onClick={() => setActiveSection(id)}
                    className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                    />
                    <span className="flex-1 text-left">{label}</span>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-indigo-600" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="my-5 h-px bg-slate-100" />

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col">
              <span data-testid="stat-tech" className="text-lg font-bold text-slate-900">
                {report.technicalQuestions?.length ?? 0}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">Tech Qs</span>
            </div>
            <div className="flex flex-col">
              <span data-testid="stat-behav" className="text-lg font-bold text-slate-900">
                {report.behavioralQuestions?.length ?? 0}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">Behav. Qs</span>
            </div>
            <div className="flex flex-col">
              <span data-testid="stat-days" className="text-lg font-bold text-slate-900">
                {report.preparationPlan?.length ?? 0}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">Days</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main data-testid="interview-main" className="min-w-0">

          {/* Technical Questions */}
          {activeSection === 'technical' && (
            <section data-testid="section-technical" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Technical Questions
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {report.technicalQuestions?.length} questions tailored to{' '}
                  <span className="font-medium text-slate-700">{report.role}</span>
                </p>
              </div>

              <div className="space-y-3">
                {report.technicalQuestions?.map((q, i) => {
                  const qid = q.id ?? i;
                  const isOpen = expandedQ === qid;
                  return (
                    <div
                      key={qid}
                      data-testid={`tech-q-${i}`}
                      onClick={() => toggleQ(qid)}
                      className={`bg-white border rounded-2xl shadow-sm transition-all cursor-pointer ${isOpen
                          ? 'border-indigo-200 ring-1 ring-indigo-100'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-9 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                          Q{i + 1}
                        </span>
                        <p className="flex-1 text-sm md:text-[15px] font-medium text-slate-800 leading-relaxed">
                          {q.question}
                        </p>
                        {q.difficulty && (
                          <span
                            className={`hidden sm:inline-flex flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${DIFFICULTY_COLOR[q.difficulty] ?? 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {q.difficulty}
                          </span>
                        )}
                        <span className="flex-shrink-0 text-slate-400">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
                          <div className="flex items-center gap-2 mt-3 text-amber-700">
                            <Lightbulb className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">Intention</span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{q.intention}</p>
                          {q.answer && (
                            <>
                              <div className="flex items-center gap-2 mt-4 text-emerald-700">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Ideal Answer</span>
                              </div>
                              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{q.answer}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Behavioral Questions */}
          {activeSection === 'behavioral' && (
            <section data-testid="section-behavioral" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Behavioral Questions
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Use the <span className="font-medium text-slate-700">STAR framework</span> —
                  Situation, Task, Action, Result
                </p>
              </div>

              <div className="space-y-3">
                {report.behavioralQuestions?.map((q, i) => {
                  const key = `b-${i}`;
                  const isOpen = expandedQ === key;
                  return (
                    <div
                      key={q.id ?? i}
                      data-testid={`behav-q-${i}`}
                      onClick={() => toggleQ(key)}
                      className={`bg-white border rounded-2xl shadow-sm transition-all cursor-pointer ${isOpen
                          ? 'border-indigo-200 ring-1 ring-indigo-100'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-9 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                          Q{i + 1}
                        </span>
                        <p className="flex-1 text-sm md:text-[15px] font-medium text-slate-800 leading-relaxed">
                          {q.question}
                        </p>
                        <span className="flex-shrink-0 text-slate-400">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
                          <div className="flex items-center gap-2 mt-3 text-amber-700">
                            <Lightbulb className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">Intention</span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{q.intention}</p>
                          {q.answer && (
                            <>
                              <div className="flex items-center gap-2 mt-4 text-indigo-700">
                                <FileText className="h-4 w-4" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Ideal Answer</span>
                              </div>
                              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{q.answer}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Roadmap */}
          {activeSection === 'roadmap' && (
            <section data-testid="section-roadmap" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Preparation Plan
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  A focused plan to close skill gaps and nail your interview
                </p>
              </div>

              <div className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-indigo-200 before:via-indigo-100 before:to-transparent">
                {report.preparationPlan?.map((item, i) => (
                  <div
                    key={i}
                    data-testid={`roadmap-${i}`}
                    className="relative flex gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    <div className="relative z-10 flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-200">
                      D{item.day}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-900">{item.focus}</h3>
                      <ul className="mt-2 space-y-1.5">
                        {item.tasks?.map((task, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Right Sidebar */}
        <aside
          data-testid="interview-sidebar"
          className="lg:sticky lg:top-28 self-start bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Skill Gaps
            </p>
            <div className="flex flex-wrap gap-2">
              {report.skillGaps?.map((skill, i) => (
                <span
                  key={i}
                  data-testid={`skill-gap-${i}`}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_COLOR[skill.severity] ?? 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {skill.skill}
                </span>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Your Strengths
            </p>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS.map((s, i) => (
                <span
                  key={i}
                  data-testid={`strength-${i}`}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />


        </aside>
      </div>
    </div>
  );
};

export default Interview;