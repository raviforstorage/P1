const Contact = require('../models/Contact');

async function submitContact(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }
    await Contact.create({ name: name.trim(), email: email.trim(), message: message.trim() });
    res.status(201).json({ message: "Message received — we'll get back to you soon." });
  } catch (err) {
    res.status(500).json({ message: 'Could not send message.', error: err.message });
  }
}

module.exports = { submitContact };
