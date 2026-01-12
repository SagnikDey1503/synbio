const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const userSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: 50,
        match: [/^[a-zA-Z\s]+$/, 'Full name can contain only letters and spaces']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },

    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },

    institute: {
        type: String,
        required: [true, 'Institute name is required'],
        trim: true,
        maxlength: 100
    },

    degree: {
        type: String,
        required: [true, 'Degree is required'],
        enum: {
            values: ['School', 'BTech', 'MTech', 'BS', 'MS', 'PhD', 'Postdoc','Other'],
            message: 'Invalid degree selection'
        }
    },

    expectations: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    }
},
{
    timestamps: true
});

/* 🔒 Sanitize all user inputs */
userSchema.pre('save', function (next) {
    const fieldsToSanitize = [
        'fullName',
        'email',
        'phoneNumber',
        'institute',
        'degree',
        'expectations'
    ];

    fieldsToSanitize.forEach(field => {
        if (this.isModified(field) && this[field]) {
            this[field] = sanitizeHtml(this[field], {
                allowedTags: [],
                allowedAttributes: {}
            });
        }
    });

    next();
});

module.exports = mongoose.model('User', userSchema);
