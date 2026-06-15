const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetRole, university } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      targetRole: targetRole || '',
      university: university || '',
      isAdmin: false,
      isBanned: false
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      university: user.university,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
      token: generateToken(user._id)
    })

  } catch (error) {
    console.error('Register error:', error.message)
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been banned. Contact support.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      university: user.university,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
      token: generateToken(user._id)
    })

  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, targetRole, university } = req.body
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, targetRole, university },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router