import React, { useState } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useinterview.js';

const DIFFICULTY_COLOR = {
  Easy: 'diff-easy',
  Medium: 'diff-medium',
  Hard: 'diff-hard',
};

export const Interview = () => {
  const { report } = useInterview();

  if (!report) {
    return <h2>Loading...</h2>;
  }

  const [activeSection, setActiveSection] = useState('technical');
  const [expandedQ, setExpandedQ] = useState(null);

  const navItems = [
    { id: 'technical', label: 'Technical Questions', icon: '💻' },
    { id: 'behavioral', label: 'Behavioral Questions', icon: '🧠' },
    { id: 'roadmap', label: 'Road Map', icon: '🗺️' },
  ];

  const toggleQ = (id) => setExpandedQ(expandedQ === id ? null : id);

  return (
    <div className="interview-page">

      <header className="interview-header">
        <div className="header-left">
          <span className="header-role">{report.role}</span>
          <span className="header-candidate">for {report.candidate}</span>
        </div>
        <div className="header-score">
          <span className="score-label">Match Score</span>
          <span className="score-value">{report.matchScore}%</span>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${report.matchScore}%` }}
            />
          </div>
        </div>
      </header>

      <div className="interview-body">

        <nav className="interview-nav">
          <p className="nav-eyebrow">Sections</p>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {activeSection === item.id && <span className="nav-indicator" />}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav-divider" />

          <div className="nav-stats">
            <div className="stat">
              <span className="stat-num">{report.technicalQuestions.length}</span>
              <span className="stat-label">Tech Qs</span>
            </div>
            <div className="stat">
              <span className="stat-num">{report.behavioralQuestions.length}</span>
              <span className="stat-label">Behav. Qs</span>
            </div>
            <div className="stat">
              <span className="stat-num">{report.roadMap.length}</span>
              <span className="stat-label">Weeks</span>
            </div>
          </div>
        </nav>

        <main className="interview-main">

          {activeSection === 'technical' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Technical Questions</h2>
                <p className="section-sub">
                  {report.technicalQuestions.length} questions tailored to {report.role}
                </p>
              </div>

              <div className="question-list">
                {report.technicalQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`question-card ${expandedQ === q.id ? 'expanded' : ''}`}
                    onClick={() => toggleQ(q.id)}
                  >
                    <div className="question-top">
                      <span className="q-num">Q{q.id}</span>
                      <p className="q-text">{q.question}</p>
                      <span className={`q-diff ${DIFFICULTY_COLOR[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className="q-chevron">
                        {expandedQ === q.id ? '▲' : '▼'}
                      </span>
                    </div>

                    {expandedQ === q.id && (
                      <div className="question-hint">
                        <span className="hint-label">💡 Hint</span>
                        <p>{q.hint}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'behavioral' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Behavioral Questions</h2>
                <p className="section-sub">
                  Use the STAR framework — Situation, Task, Action, Result
                </p>
              </div>

              <div className="question-list">
                {report.behavioralQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`question-card ${expandedQ === q.id ? 'expanded' : ''}`}
                    onClick={() => toggleQ(q.id)}
                  >
                    <div className="question-top">
                      <span className="q-num">Q{q.id}</span>
                      <p className="q-text">{q.question}</p>
                      <span className="q-framework">{q.framework}</span>
                      <span className="q-chevron">
                        {expandedQ === q.id ? '▲' : '▼'}
                      </span>
                    </div>

                    {expandedQ === q.id && (
                      <div className="question-hint">
                        <span className="hint-label">📝 Framework</span>
                        <p>
                          Structure your answer: <strong>Situation</strong> →{" "}
                          <strong>Task</strong> → <strong>Action</strong> →{" "}
                          <strong>Result</strong>. Keep it under 2 minutes.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'roadmap' && (
            <section className="content-section">
              <div className="section-header">
                <h2>4-Week Preparation Plan</h2>
                <p className="section-sub">
                  A focused plan to close skill gaps and nail your interview
                </p>
              </div>

              <div className="roadmap-list">
                {report.roadMap.map((week, i) => (
                  <div key={i} className="roadmap-card">
                    <div className="roadmap-week-badge">{week.week}</div>

                    <div className="roadmap-content">
                      <h3 className="roadmap-focus">{week.focus}</h3>

                      <ul className="roadmap-tasks">
                        {week.tasks.map((task, j) => (
                          <li key={j}>
                            <span className="task-dot" />
                            {task}
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

        <aside className="interview-sidebar">
          <p className="sidebar-eyebrow">Skill Gaps</p>

          <div className="skill-gap-list">
            {report.skillGaps.map((skill, i) => (
              <span key={i} className="skill-chip">
                {skill}
              </span>
            ))}
          </div>

          <div className="sidebar-divider" />

          <p className="sidebar-eyebrow">Your Strengths</p>

          <div className="skill-gap-list">
            {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT Auth', 'Git'].map((s, i) => (
              <span key={i} className="skill-chip strength">
                {s}
              </span>
            ))}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-tip">
            <span className="tip-icon">✨</span>
            <p>Your HireReady project is a strong talking point — mention the Puppeteer PDF pipeline.</p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Interview;