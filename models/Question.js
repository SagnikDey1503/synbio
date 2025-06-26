const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 30
    },
    answer: {
        type: Number,
        required: true,
        min: 0,
        max: 9999
    },
    maxAttempts: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 3
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);