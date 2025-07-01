const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    type: {
        type: String,
        enum: ['general', 'correction', 'urgent'],
        default: 'general'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

// Helper function to get current IST date
function getISTDate() {
    const utc = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    return new Date(utc.getTime() + offset);
}

// Pre-save hook to set IST timestamps on creation
announcementSchema.pre('save', function (next) {
    const nowIST = getISTDate();
    if (!this.createdAt) this.createdAt = nowIST;
    this.updatedAt = nowIST;
    next();
});

// Pre-update hook to set IST timestamp on update
announcementSchema.pre('findOneAndUpdate', function (next) {
    this._update.updatedAt = getISTDate();
    next();
});

module.exports = mongoose.model('Announcement', announcementSchema);
