const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },

    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        match: [/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces']
    },

    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    }
}, {
    timestamps: true // adds createdAt & updatedAt
});

// ✅ Sanitize inputs
userSchema.pre('save', function (next) {
    if (this.isModified('email')) {
        this.email = sanitizeHtml(this.email, { allowedTags: [], allowedAttributes: {} });
    }
    if (this.isModified('fullName')) {
        this.fullName = sanitizeHtml(this.fullName, { allowedTags: [], allowedAttributes: {} });
    }
    if (this.isModified('phoneNumber')) {
        this.phoneNumber = sanitizeHtml(this.phoneNumber, { allowedTags: [], allowedAttributes: {} });
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
