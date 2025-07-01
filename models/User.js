const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
        match: [/^[a-zA-Z0-9_@ ]+$/, 'Username can only contain letters, numbers, underscores (_), spaces, and @.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        match: [/^[a-zA-Z0-9\s]+$/, 'Full name can only contain letters, numbers, and spaces.']
    },
    category: {
        type: String,
        required: true,
        enum: ["Junior", "Senior"],
        default: "Senior"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    score: {
        type: Number,
        default: 0
    },
    attempts: [{
        questionId: Number,
        attemptCount: {
            type: Number,
            default: 0
        }
    }],
    lastActivity: {
        type: Date,
        default: () => new Date()
    }
}, {
    timestamps: true // ✅ Automatically adds `createdAt` and `updatedAt`
});

// ✅ Sanitize + hash on save
userSchema.pre('save', async function(next) {
    // Sanitize
    if (this.isModified('username')) {
        this.username = sanitizeHtml(this.username, { allowedTags: [], allowedAttributes: {} });
    }
    if (this.isModified('email')) {
        this.email = sanitizeHtml(this.email, { allowedTags: [], allowedAttributes: {} });
    }
    if (this.isModified('fullName')) {
        this.fullName = sanitizeHtml(this.fullName, { allowedTags: [], allowedAttributes: {} });
    }

    // Hash password
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// ✅ Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
