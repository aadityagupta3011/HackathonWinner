const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ email, passwordHash, profile: { name } });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, profile: user.profile }});
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid creds' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid creds' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, profile: user.profile }});
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;
