// models/Contact.js
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🛡️ Sanitize all string fields before saving
querySchema.pre('save', function (next) {
  this.name = sanitizeHtml(this.name, { allowedTags: [], allowedAttributes: {} });
  this.email = sanitizeHtml(this.email, { allowedTags: [], allowedAttributes: {} });
  this.subject = sanitizeHtml(this.subject, { allowedTags: [], allowedAttributes: {} });
  this.message = sanitizeHtml(this.message, { allowedTags: [], allowedAttributes: {} });
  next();
});

module.exports = mongoose.model('Query', querySchema);
