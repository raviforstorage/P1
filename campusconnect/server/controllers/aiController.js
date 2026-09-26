// Rule-based fallback so the feature still works with no API key / no internet
// at the venue. This is what runs whenever AI_ENABLED is not "true" or the
// Anthropic call fails for any reason.
function offlineReply(message) {
  const m = message.toLowerCase();
  if (m.includes('exam') || m.includes('tip')) {
    return "Before an exam: skim your resolved doubts on this dashboard first — they're the questions you already struggled with once.";
  }
  if (m.includes('submit') || m.includes('doubt') || m.includes('post')) {
    return "Fill the Subject and Question boxes on your dashboard and click 'Submit doubt'. It appears instantly in the admin queue.";
  }
  if (m.includes('resource') || m.includes('notes')) {
    return 'Check the Shared resources panel — it lists notes, videos and sheets your admin has uploaded.';
  }
  if (m.includes('status') || m.includes('pending') || m.includes('resolved')) {
    return "Pending means an admin hasn't replied yet; Resolved means your question has an answer.";
  }
  if (m.includes('hello') || m.includes('hi')) {
    return 'Hey! Ask me about submitting doubts, finding resources, or general study tips.';
  }
  return "I'm running in offline mode right now — try asking about 'exam tips', 'how to submit a doubt', or 'resources'.";
}

// POST /api/ai/ask  { message: string }
// The Anthropic API key never reaches the browser: this call happens
// entirely server-side, using the key from server/.env.
async function askAI(req, res) {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'A message is required.' });
  }

  const aiEnabled = process.env.AI_ENABLED === 'true' && !!process.env.ANTHROPIC_API_KEY;

  if (!aiEnabled) {
    return res.json({ reply: offlineReply(message), mode: 'offline' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system:
          'You are a concise study assistant inside a college doubt-resolution portal called CampusConnect. Keep answers under 60 words.',
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API responded with ${response.status}`);
    }

    const data = await response.json();
    const textBlock = data.content.find((block) => block.type === 'text');
    const reply = textBlock ? textBlock.text : offlineReply(message);
    res.json({ reply, mode: 'live' });
  } catch (err) {
    // Never fail the request just because the AI call failed — degrade to offline mode.
    res.json({ reply: offlineReply(message), mode: 'offline-fallback', error: err.message });
  }
}

module.exports = { askAI };
