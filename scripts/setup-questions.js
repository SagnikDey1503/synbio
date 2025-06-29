// Script to populate database with questions
// Run this with: node scripts/setup-questions.js

const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('../models/Question');

const sampleQuestions = [
    // Questions 1-10 have 3 attempts
    { id: 1, answer: 1234, maxAttempts: 3 },
    { id: 2, answer: 5678, maxAttempts: 3 },
    { id: 3, answer: 9012, maxAttempts: 3 },
    { id: 4, answer: 3456, maxAttempts: 3 },
    { id: 5, answer: 7890, maxAttempts: 3 },
    { id: 6, answer: 2468, maxAttempts: 3 },
    { id: 7, answer: 1357, maxAttempts: 3 },
    { id: 8, answer: 8642, maxAttempts: 3 },
    { id: 9, answer: 9753, maxAttempts: 3 },
    { id: 10, answer: 1111, maxAttempts: 3 },

    // // Questions 11-20 have 2 attempts
    { id: 11, answer: 2222, maxAttempts: 2 },
    { id: 12, answer: 3333, maxAttempts: 2 },
    { id: 13, answer: 4444, maxAttempts: 1},
    // { id: 14, answer: 5555, maxAttempts: 2 },
    // { id: 15, answer: 6666, maxAttempts: 2 },
    // { id: 16, answer: 7777, maxAttempts: 2 },
    // { id: 17, answer: 8888, maxAttempts: 2 },
    // { id: 18, answer: 9999, maxAttempts: 2 },
    // { id: 19, answer: 1010, maxAttempts: 2 },
    // { id: 20, answer: 2020, maxAttempts: 2 },

    // // Questions 21-30 have 1 attempt only
    // { id: 21, answer: 100, maxAttempts: 1 },
    // { id: 22, answer: 200, maxAttempts: 1 },
    // { id: 23, answer: 300, maxAttempts: 1 },
    // { id: 24, answer: 400, maxAttempts: 1 },
    // { id: 25, answer: 500, maxAttempts: 1 },
    // { id: 26, answer: 600, maxAttempts: 1 },
    // { id: 27, answer: 700, maxAttempts: 1 },
    // { id: 28, answer: 800, maxAttempts: 1 },
    // { id: 29, answer: 900, maxAttempts: 1 },
    // { id: 30, answer: 999, maxAttempts: 1 }
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