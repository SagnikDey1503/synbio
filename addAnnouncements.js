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
  title: '📚 Quizzicles Exam Study Material',
  content: '👉 https://drive.google.com/drive/folders/1nvunXoa77ufJ-mZ-ZzUaFr-0sX1w-NMw 👈  Keep checking—updates may be added anytime.',
  type: 'urgent',
  isActive: true,
  authorId: '68681972cfb47a715782b158'
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
