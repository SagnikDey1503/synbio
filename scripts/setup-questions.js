// Script to populate database with questions
// Run this with: node scripts/setup-questions.js

const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('../models/Question');

// const sampleQuestions = [
//     { id: 1, correctAnswer: 1234, tolerance: 1, maxAttempts: 3, points: 10 },
//     { id: 2, correctAnswer: 5678, tolerance: 2, maxAttempts: 2, points: 15 },
//     { id: 3, correctAnswer: 9012, tolerance: 0, maxAttempts: 3, points: 20 },
//     { id: 4, correctAnswer: 3456, tolerance: 1, maxAttempts: 1, points: 25 },
//     { id: 5, correctAnswer: 7890, tolerance: 0, maxAttempts: 3, points: 10 },
//     { id: 6, correctAnswer: 2468, tolerance: 3, maxAttempts: 3, points: 12 },
//     { id: 7, correctAnswer: 1357, tolerance: 2, maxAttempts: 3, points: 18 },
//     { id: 8, correctAnswer: 8642, tolerance: 2, maxAttempts: 3, points: 14 },
//     { id: 9, correctAnswer: 9753, tolerance: 4, maxAttempts: 3, points: 22 },
//     { id: 10, correctAnswer: 1111, tolerance: 0, maxAttempts: 3, points: 16 },

//     // You can continue adding more questions with appropriate point values
//     // { id: 11, correctAnswer: 2222, tolerance: 1, maxAttempts: 2, points: 10 },
//     // { id: 12, correctAnswer: 3333, tolerance: 2, maxAttempts: 2, points: 10 },
//     // { id: 13, correctAnswer: 4444, tolerance: 0, maxAttempts: 1, points: 15 }
// ];
const sampleQuestions = [
  { id:  1, correctAnswer:    2, tolerance: 0, maxAttempts: 1, points:     },
  { id:  2, correctAnswer:   30, tolerance: 0, maxAttempts: 1, points:     },
  { id:  3, correctAnswer:  207, tolerance: 1, maxAttempts: 1, points:     },
  { id:  4, correctAnswer: 2340, tolerance: 0, maxAttempts: 1, points:     },
  { id:  5, correctAnswer:    7, tolerance: 0, maxAttempts: 1, points:     },
  { id:  6, correctAnswer:     , tolerance: 0, maxAttempts: 1, points:     }, //tbp
  { id:  7, correctAnswer:   11, tolerance: 0, maxAttempts: 1, points:     },
  { id:  8, correctAnswer: 2519, tolerance: 0, maxAttempts: 1, points:     },
  { id:  9, correctAnswer:  757, tolerance: 0, maxAttempts: 1, points:     },
  { id: 10, correctAnswer: 1284, tolerance: 0, maxAttempts: 1, points:     },
  { id: 11, correctAnswer:  981, tolerance: 0, maxAttempts: 1, points:     },
  { id: 12, correctAnswer:    1, tolerance: 0, maxAttempts: 1, points:     },
  { id: 13, correctAnswer:   60, tolerance: 0, maxAttempts: 1, points:     },
  { id: 14, correctAnswer:  565, tolerance: 0, maxAttempts: 1, points:     },
  { id: 15, correctAnswer: 1233, tolerance: 0, maxAttempts: 1, points:     },
  { id: 16, correctAnswer:  271, tolerance: 4, maxAttempts: 1, points:     },
  { id: 17, correctAnswer:  228, tolerance: 0, maxAttempts: 1, points:     },
  { id: 18, correctAnswer:  4130 , tolerance: 0, maxAttempts: 1, points:     }, //needs modification - modified
  { id: 19, correctAnswer:   10, tolerance: 0, maxAttempts: 1, points:     },
  { id: 20, correctAnswer: 3591, tolerance: 0, maxAttempts: 1, points:     },
  { id: 21, correctAnswer:   14, tolerance: 0, maxAttempts: 1, points:     },
  { id: 22, correctAnswer:    2, tolerance: 0, maxAttempts: 1, points:     },
  { id: 23, correctAnswer:  737, tolerance: 0, maxAttempts: 1, points:     },
  { id: 24, correctAnswer:     , tolerance: 0, maxAttempts: 1, points:     }, //needs answer
  { id: 25, correctAnswer:   54, tolerance: 0, maxAttempts: 1, points:     },
  { id: 26, correctAnswer:    3, tolerance: 0, maxAttempts: 1, points:     },
  { id: 27, correctAnswer:    2, tolerance: 0, maxAttempts: 1, points:     },
  { id: 28, correctAnswer:    0, tolerance: 0, maxAttempts: 1, points:     },
  { id: 29, correctAnswer: 1000, tolerance: 0, maxAttempts: 1, points:     },
  { id: 30, correctAnswer:   92, tolerance: 0, maxAttempts: 1, points:     },
  { id: 31, correctAnswer:  817, tolerance: 0, maxAttempts: 1, points:     },
  { id: 32, correctAnswer:   17, tolerance: 0, maxAttempts: 1, points:     },
  { id: 33, correctAnswer:    9, tolerance: 0, maxAttempts: 1, points:     }, //may change
  { id: 34, correctAnswer: 8865, tolerance: 0, maxAttempts: 1, points:     },
  { id: 35, correctAnswer:   61, tolerance: 0, maxAttempts: 1, points:     },
  { id: 36, correctAnswer:   30, tolerance: 0, maxAttempts: 1, points:     }, //needs modification modified ans
  { id: 37, correctAnswer:   13, tolerance: 0, maxAttempts: 1, points:     },
  { id: 38, correctAnswer:  130, tolerance: 0, maxAttempts: 1, points:     },
  { id: 39, correctAnswer:   10, tolerance: 0, maxAttempts: 1, points:     },
  { id: 40, correctAnswer:  375, tolerance: 0, maxAttempts: 1, points:     },
  { id: 41, correctAnswer:   10, tolerance: 7, maxAttempts: 1, points:     }, //check once ans 4-17
  { id: 42, correctAnswer:   15, tolerance: 0, maxAttempts: 1, points:     },
  { id: 43, correctAnswer:   60, tolerance: 0, maxAttempts: 1, points:     },
  // { id: 44, correctAnswer:     , tolerance: 0, maxAttempts: 1, points:     },
  // { id: 45, correctAnswer:     , tolerance: 0, maxAttempts: 1, points:     }
];


async function setupQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing questions
        await Question.deleteMany({});
        console.log('🧹 Cleared existing questions');

        // Insert new questions
        await Question.insertMany(sampleQuestions);
        console.log('✅ Questions inserted successfully!');

        console.log('\n📊 Question setup complete:');
        console.log('- Each question now includes variable point values');
        console.log('- Check schema and frontend to reflect new scoring');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up questions:', error);
        process.exit(1);
    }
}

setupQuestions();
