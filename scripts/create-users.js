// Script to create user accounts
// Run this with: node scripts/create-users.js

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const sampleUsers = [
  // Bengali Users
  {
    username: "arnab10",
    email: "arnab10@example.com",
    password: "password123",
    fullName: "Arnab Chatterjee",
    category: "Junior"
  },
  {
    username: "moumita8",
    email: "moumita8@example.com",
    password: "password123",
    fullName: "Moumita Ghosh",
    category: "Junior"
  },
  {
    username: "sourav11",
    email: "sourav11@example.com",
    password: "password123",
    fullName: "Sourav Banerjee",
    category: "Senior"
  },
  {
    username: "ananya12",
    email: "ananya12@example.com",
    password: "password123",
    fullName: "Ananya Das",
    category: "Senior"
  },
  {
    username: "riddhi9",
    email: "riddhi9@example.com",
    password: "password123",
    fullName: "Riddhi Sen",
    category: "Junior"
  },
  {
    username: "subho13",
    email: "subho13@example.com",
    password: "password123",
    fullName: "Subhojit Mukherjee",
    category: "Senior"
  },
  {
    username: "titli7",
    email: "titli7@example.com",
    password: "password123",
    fullName: "Titli Roy",
    category: "Junior"
  },

  // Non-Bengali Users
  {
    username: "neha12",
    email: "neha12@example.com",
    password: "password123",
    fullName: "Neha Sharma",
    category: "Senior"
  },
  {
    username: "rajat8",
    email: "rajat8@example.com",
    password: "password123",
    fullName: "Rajat Verma",
    category: "Junior"
  },
  {
    username: "aditya10",
    email: "aditya10@example.com",
    password: "password123",
    fullName: "Aditya Rathi",
    category: "Senior"
  }
];


async function createUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ username: userData.username });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                console.log(`Created user: ${userData.username} (${userData.teamName})`);
            } else {
                console.log(`User ${userData.username} already exists`);
            }
        }

        console.log('\nUser creation complete!');
        console.log('\nLogin credentials:');
        sampleUsers.forEach(user => {
            console.log(`${user.username} / ${user.password} (${user.teamName})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating users:', error);
        process.exit(1);
    }
}

createUsers();