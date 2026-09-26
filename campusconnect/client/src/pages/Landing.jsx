import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';

export default function Landing() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  async function handleContact(e) {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const { data } = await api.post('/contact', form);
      setStatus(data.message);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not send your message. Please try again.');
    }
  }

  return (
    <div>
      <Navbar />

      <section className="hero">
        <div className="container">
          <h1>Ask a doubt at midnight. Get it answered before your first class.</h1>
          <p>
            CampusConnect is the shared doubt-desk and resource shelf for our department —
            students post questions and find notes, admins keep every query on record and answered.
          </p>
          <div className="cta">
            <Link className="btn btn-gold" to="/signup">
              Create your account
            </Link>
            <Link className="btn btn-outline" to="/login">
              I already have one
            </Link>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="container">
          <div className="eyebrow-row">
            <h2>How it works</h2>
          </div>
          <div className="steps">
            {[
              ['1', 'Sign up', 'Register as a student or an admin in under a minute.'],
              ['2', 'Post a doubt', 'Students submit a question with subject and details.'],
              ['3', 'Admin responds', 'Admins review the queue and mark each one resolved.'],
              ['4', 'Track & learn', 'Students see replies and browse shared resources.'],
            ].map(([num, title, body]) => (
              <div className="step" key={num}>
                <div className="num">{num}</div>
                <h3 style={{ fontSize: 16 }}>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about">
        <div className="container about-grid">
          <div>
            <h2>Built by students who were tired of losing questions in group-chat scroll</h2>
            <p style={{ color: 'var(--ink-soft)' }}>
              Every semester, the same doubts get asked and re-asked because nothing is written
              down. CampusConnect gives every question a permanent home, a status, and an owner —
              so nothing falls through the cracks between a student and the faculty desk.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>Why it works</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>
              One shared queue instead of five WhatsApp groups. One dashboard for admins instead
              of a notebook. One place for resources instead of a dozen shared-drive links.
            </p>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="container">
          <div className="eyebrow-row">
            <h2>What people are saying</h2>
          </div>
          <div className="testimonials">
            {[
              ['I posted a doubt at 11pm and had an answer before my morning lecture.', 'Priya S., 3rd year'],
              ['First time I can see every open student query in one queue instead of six inboxes.', 'Prof. R. Mehta, Admin'],
              ['The resource shelf alone saved me during exam week.', 'Aman K., 2nd year'],
            ].map(([quote, who]) => (
              <div className="tcard" key={who}>
                <p>&ldquo;{quote}&rdquo;</p>
                <div className="who">— {who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <div className="eyebrow-row">
            <h2>Contact us</h2>
          </div>
          <form className="contact-form" onSubmit={handleContact}>
            <div className="field">
              <label>Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea
                rows="3"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <button className="btn" type="submit">
              Send message
            </button>
            <div className="ok-msg">{status}</div>
          </form>
        </div>
      </section>

      <footer>
        <div className="container footwrap">
          <div>
            <div className="brand" style={{ color: 'var(--paper)' }}>
              Campus<span>Connect</span>
            </div>
            <p style={{ maxWidth: 280, fontSize: 13, color: '#ffffffaa' }}>
              A doubt-resolution and resource-sharing portal for our department.
            </p>
          </div>
          <div>
            <h3 style={{ color: 'var(--paper)', fontSize: 14 }}>Links</h3>
            <p style={{ fontSize: 13 }}><a href="#how">How it works</a></p>
            <p style={{ fontSize: 13 }}><a href="#about">About us</a></p>
            <p style={{ fontSize: 13 }}><a href="#testimonials">Testimonials</a></p>
          </div>
          <div>
            <h3 style={{ color: 'var(--paper)', fontSize: 14 }}>Get started</h3>
            <p style={{ fontSize: 13 }}><Link to="/signup">Sign up</Link></p>
            <p style={{ fontSize: 13 }}><Link to="/login">Log in</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
