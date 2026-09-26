import { useEffect, useState } from 'react';
import api from '../api/api';
import DashboardHeader from '../components/DashboardHeader';
import AiAssistant from '../components/AiAssistant';

const RESOURCES = [
  { tag: 'Notes', title: 'Data Structures — Trees & Graphs PDF' },
  { tag: 'Video', title: 'OS Scheduling Algorithms — recorded lecture' },
  { tag: 'Sheet', title: 'DBMS Normalization practice sheet' },
];

export default function StudentDashboard() {
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function loadSubmissions() {
    setLoading(true);
    try {
      const { data } = await api.get('/submissions/mine');
      setSubmissions(data.submissions);
    } catch (error) {
      setErr('Could not load your doubts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !text.trim()) return;
    try {
      await api.post('/submissions', { subject, text });
      setSubject('');
      setText('');
      loadSubmissions();
    } catch (error) {
      setErr(error.response?.data?.message || 'Could not submit your doubt.');
    }
  }

  const pending = submissions.filter((s) => s.status === 'Pending').length;
  const resolved = submissions.filter((s) => s.status === 'Resolved').length;

  return (
    <div className="container">
      <DashboardHeader title="Student Dashboard" />

      <div className="stat-row">
        <div className="stat">
          <div className="n">{submissions.length}</div>
          <div className="l">Doubts posted</div>
        </div>
        <div className="stat">
          <div className="n">{pending}</div>
          <div className="l">Pending</div>
        </div>
        <div className="stat">
          <div className="n">{resolved}</div>
          <div className="l">Resolved</div>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <div className="panel">
            <h3>Post a new doubt</h3>
            <div className="field">
              <label>Subject</label>
              <input
                type="text"
                placeholder="e.g. Data Structures"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Your question</label>
              <textarea
                rows="3"
                placeholder="Type your doubt in detail..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            {err && <div className="err">{err}</div>}
            <button className="btn" onClick={handleSubmit}>
              Submit doubt
            </button>
          </div>

          <div className="panel">
            <h3>My doubts</h3>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Question</th>
                  <th>Status</th>
                  <th>Admin reply</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ color: 'var(--ink-soft)' }}>
                      Loading…
                    </td>
                  </tr>
                ) : submissions.length ? (
                  submissions.map((q) => (
                    <tr key={q._id}>
                      <td>{q.subject}</td>
                      <td>{q.text}</td>
                      <td>
                        <span className={`badge ${q.status === 'Resolved' ? 'resolved' : 'pending'}`}>
                          {q.status}
                        </span>
                      </td>
                      <td>{q.reply || <span style={{ color: 'var(--ink-soft)' }}>—</span>}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ color: 'var(--ink-soft)' }}>
                      No doubts posted yet — ask your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="panel">
            <h3>Shared resources</h3>
            {RESOURCES.map((r) => (
              <div className="res-item" key={r.title}>
                <span className="tag">{r.tag}</span>
                <br />
                {r.title}
              </div>
            ))}
          </div>
          <AiAssistant />
        </div>
      </div>
    </div>
  );
}
