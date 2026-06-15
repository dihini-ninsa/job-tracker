const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Application = require('../models/Application')

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token === 'admin-hardcoded-token') {
    next()
  } else {
    res.status(403).json({ message: 'Admin access required' })
  }
}

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalApplications = await Application.countDocuments()
    const totalOffers = await Application.countDocuments({ status: 'Offer' })
    const totalInterviews = await Application.countDocuments({ status: 'Interview' })
    const bannedUsers = await User.countDocuments({ isBanned: true })
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    })
    res.json({
      totalUsers,
      totalApplications,
      totalOffers,
      totalInterviews,
      bannedUsers,
      newUsersThisMonth
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
    const usersWithCounts = await Promise.all(users.map(async (user) => {
      const appCount = await Application.countDocuments({ userId: user._id })
      return { ...user.toObject(), appCount }
    }))
    res.json(usersWithCounts)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/users/:id/applications
router.get('/users/:id/applications', adminAuth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/admin/users/:id
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await Application.deleteMany({ userId: req.params.id })
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/admin/users/:id/ban
router.put('/users/:id/ban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.isBanned = !user.isBanned
    await user.save()
    res.json({ isBanned: user.isBanned })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router