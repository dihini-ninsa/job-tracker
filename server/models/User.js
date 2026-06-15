const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  targetRole: { type: String, default: '' },
  university: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)