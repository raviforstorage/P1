import { useEffect, useState } from 'react';
import api from '../api/api';
import DashboardHeader from '../components/DashboardHeader';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, studentCount: 0 });
  const [drafts, setDrafts] = useState({}); // { [submissionId]: replyText }
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [subsRes, studentsRes, statsRes] = await Promise.all([
        api.get('/submissions'),
        api.get('/submissions/meta/students'),
        api.get('/submissions/meta/stats'),
      ]);
      setSubmissions(subsRes.data.submissions);
      setStudents(studentsRes.data.students);
      setStats(statsRes.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function respond(id) {
    const reply = drafts[id] ?? '';
    await api.patch(`/submissions/${id}`, { reply });
    loadAll();
  }

  return (
    <div className="container">
      <DashboardHeader title="Admin Dashboard" />

      <div className="stat-row">
        <div className="stat">
          <div className="n">{stats.total}</div>
          <div className="l">Total doubts</div>
        </div>
        <div className="stat">
          <div className="n">{stats.pending}</div>
          <div className="l">Awaiting reply</div>
        </div>
        <div className="stat">
          <div className="n">{stats.studentCount}</div>
          <div className="l">Registered students</div>
        </div>
      </div>

      <div className="panel">
        <h3>All student doubts</h3>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Question</th>
              <th>Status</th>
              <th>Reply</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ color: 'var(--ink-soft)' }}>
                  Loading…
                </td>
              </tr>
            ) : submissions.length ? (
              submissions.map((q) => (
                <tr key={q._id}>
                  <td>{q.studentName}</td>
                  <td>{q.subject}</td>
                  <td>{q.text}</td>
                  <td>
                    <span className={`badge ${q.status === 'Resolved' ? 'resolved' : 'pending'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Write a reply"
                      value={drafts[q._id] ?? q.reply ?? ''}
                      onChange={(e) => setDrafts({ ...drafts, [q._id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '6px 10px', fontSize: 13 }}
                      onClick={() => respond(q._id)}
                    >
                      Save & resolve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ color: 'var(--ink-soft)' }}>
                  No doubts submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>Registered students</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Doubts posted</th>
            </tr>
          </thead>
          <tbody>
            {students.length ? (
              students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.doubtsPosted}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ color: 'var(--ink-soft)' }}>
                  No students registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
