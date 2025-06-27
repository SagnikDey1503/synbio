const mongoose = require('mongoose');
const Announcement = require('./models/Announcement'); // Adjust path if needed
require('dotenv').config(); // Load your MONGODB_URI from .env

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  return addAnnouncement();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

async function addAnnouncement() {
  try {
    // Replace these values manually
    const announcementData = {
      title: 'Round 1 Released!',
      content: 'Round 1 is now live. Go to the contest page to begin.',
      type: 'urgent', // 'general', 'correction', or 'urgent'
      isActive: true,
      authorId: '685ea4ad9cf468642b12e14f' // ⚠️ Replace with a valid ObjectId from your User collection
    };

    const newAnnouncement = new Announcement(announcementData);
    await newAnnouncement.save();

    console.log('✅ Announcement saved successfully!');
  } catch (err) {
    console.error('❌ Error saving announcement:', err.message);
  } finally {
    mongoose.disconnect();
  }
}
