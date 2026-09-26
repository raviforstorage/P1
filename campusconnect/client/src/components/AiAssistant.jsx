import { useState } from 'react';
import api from '../api/api';

// Bonus AI feature. Calls the backend, which itself decides whether to hit
// the real Anthropic API (if ANTHROPIC_API_KEY + AI_ENABLED are set) or
// fall back to an offline rule-based reply. The frontend never sees the key.
export default function AiAssistant() {
  const [log, setLog] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function ask() {
    const text = input.trim();
    if (!text) return;
    setLog((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/ask', { message: text });
      setLog((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setLog((prev) => [
        ...prev,
        { role: 'bot', text: "Sorry, I couldn't reach the assistant right now." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel ai-box">
      <h3>
        AI Study Assistant <span style={{ fontSize: 11, fontWeight: 400 }}>(bonus feature)</span>
      </h3>
      <div className="ai-log">
        {log.map((m, i) => (
          <div className={`ai-msg ${m.role}`} key={i}>
            {m.text}
          </div>
        ))}
        {loading && <div className="ai-msg bot">Thinking…</div>}
      </div>
      <div className="ai-row">
        <input
          type="text"
          placeholder="Ask e.g. 'exam tips' or 'how do I submit a doubt'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
        />
        <button className="btn btn-gold" onClick={ask}>
          Ask
        </button>
      </div>
    </div>
  );
}
