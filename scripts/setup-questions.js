// Script to populate database with questions
// Run this with: node scripts/setup-questions.js

const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('../models/Question');

const sampleQuestions = [
    { id: 1, correctAnswer: 1234, tolerance: 1, maxAttempts: 3 },
    { id: 2, correctAnswer: 5678, tolerance: 2, maxAttempts:2  },
    { id: 3, correctAnswer: 9012, tolerance: 0, maxAttempts: 3 },
    { id: 4, correctAnswer: 3456, tolerance: 1, maxAttempts: 1 },
    { id: 5, correctAnswer: 7890, tolerance: 0, maxAttempts: 3 },
    { id: 6, correctAnswer: 2468, tolerance: 3, maxAttempts: 3 },
    { id: 7, correctAnswer: 1357, tolerance: 2, maxAttempts: 3 },
    { id: 8, correctAnswer: 8642, tolerance: 2, maxAttempts: 3 },
    { id: 9, correctAnswer: 9753, tolerance: 4, maxAttempts: 3 },
    { id: 10, correctAnswer: 1111, tolerance: 0, maxAttempts: 3 },

    // { id: 11, correctAnswer: 2222, tolerance: 1, maxAttempts: 2 },
    // { id: 12, correctAnswer: 3333, tolerance: 2, maxAttempts: 2 },
    // { id: 13, correctAnswer: 4444, tolerance: 0, maxAttempts: 1 }
    // You can add more similarly...
];

async function setupQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing questions
        await Question.deleteMany({});
        console.log('Cleared existing questions');

        // Insert new questions
        await Question.insertMany(sampleQuestions);
        console.log('Questions inserted successfully!');

        console.log('\nQuestion setup complete:');
        console.log('- Questions 1-10: 3 attempts each');
        console.log('- Questions 11-20: 2 attempts each');
        console.log('- Questions 21-30: 1 attempt each');

        process.exit(0);
    } catch (error) {
        console.error('Error setting up questions:', error);
        process.exit(1);
    }
}

setupQuestions();