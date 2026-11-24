const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');

const hashPassword = (password, salt) =>
  crypto.scryptSync(password, salt, 64).toString('hex');

const publicUser = (u) => ({
  sub: u.auth0Id,
  email: u.email,
  name: u.name,
  picture: u.picture || '',
  role: u.role,
  'https://harvest-system.com/claims/roles': u.role === 'admin' ? ['admin'] : []
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, nic, gender, address, province, district, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (!['farmer', 'merchant', 'transporter'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = crypto.randomBytes(16).toString('hex');
    const user = await User.create({
      auth0Id: `local|${crypto.randomBytes(12).toString('hex')}`,
      email: cleanEmail,
      name,
      phone: phone || '-',
      nic: nic || '-',
      gender, address, province, district, role,
      picture: '',
      passwordSalt: salt,
      passwordHash: hashPassword(String(password), salt)
    });
    res.status(201).json({ token: crypto.randomBytes(24).toString('hex'), user: publicUser(user) });
  } catch (err) {
    if (err && err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'value';
      const label = { nic: 'NIC', email: 'Email', phone: 'Phone number' }[field] || field;
      return res.status(400).json({ message: `${label} is already registered` });
    }
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user || !user.passwordHash || !user.passwordSalt) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const attempt = Buffer.from(hashPassword(String(password), user.passwordSalt), 'hex');
    const stored = Buffer.from(user.passwordHash, 'hex');
    if (attempt.length !== stored.length || !crypto.timingSafeEqual(attempt, stored)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ token: crypto.randomBytes(24).toString('hex'), user: publicUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
