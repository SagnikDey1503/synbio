// Script to create user accounts
// Run this with: node scripts/create-users.js

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const sampleUsers = [
    { username: 'team1', password: 'password123', teamName: 'Lightning Bolts' },
    { username: 'team2', password: 'password123', teamName: 'Brain Busters' },
    { username: 'team3', password: 'password123', teamName: 'Quiz Masters' },
    { username: 'team4', password: 'password123', teamName: 'Smart Cookies' },
    { username: 'team5', password: 'password123', teamName: 'Think Tank' },
    { username: 'admin', password: 'admin123', teamName: 'Organizers' }
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