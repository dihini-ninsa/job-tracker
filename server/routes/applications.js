const express = require('express')
const router = express.Router()
const Application = require('../models/Application')
const { protect } = require('../middleware/authMiddleware')
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')

const upload = multer({ storage: multer.memoryStorage() })

// GET /api/applications — get all for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .sort({ createdAt: -1 })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/applications — add new application
router.post('/', protect, async (req, res) => {
  try {
    const { company, role, dateApplied, status, jobDescription, notes } = req.body

    const application = await Application.create({
      userId: req.userId,
      company,
      role,
      dateApplied,
      status,
      jobDescription,
      notes
    })

    res.status(201).json(application)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/applications/:id — update application
router.put('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/applications/:id — delete application
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    await Application.findByIdAndDelete(req.params.id)
    res.json({ message: 'Application deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/applications/analyze-resume — AI resume analysis
router.post('/analyze-resume', protect, upload.single('cv'), async (req, res) => {
  try {
    const formData = new FormData()
    formData.append('jobDescription', req.body.jobDescription || '')

    if (req.file) {
      formData.append('cv', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      })
    }

    const response = await axios.post('http://localhost:5001/analyze', formData, {
      headers: formData.getHeaders()
    })

    res.json(response.data)
  } catch (error) {
    console.error('AI Service error:', error.message)
    res.status(500).json({
      message: 'AI service error — make sure Flask is running on port 5001',
      error: error.message
    })
  }
})

module.exports = router