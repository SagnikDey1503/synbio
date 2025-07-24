const mongoose = require('mongoose');
const Submission = require('./models/Submission');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  runReports();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

async function runReports() {
  try {
    // Step 1: Find all duplicates
    const duplicateCorrects = await Submission.aggregate([
      { $match: { isCorrect: true } },
      {
        $group: {
          _id: { userId: "$userId", questionId: "$questionId" },
          submissions: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]);

    if (duplicateCorrects.length === 0) {
      console.log("\n✅ No duplicate correct submissions found.");
      process.exit(0);
    }

    console.log(`\n⚠️ Found ${duplicateCorrects.length} duplicate (userId, questionId) correct submissions.`);

    // Step 2: Adjust user scores
    for (const entry of duplicateCorrects) {
      const { userId, questionId } = entry._id;
      const sortedSubs = entry.submissions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      // First correct submission is valid; rest are extra
      const validSubmission = sortedSubs[0];
      const duplicateSubmissions = sortedSubs.slice(1);
      
      const duplicatePoints = duplicateSubmissions.reduce((sum, sub) => sum + (sub.pointsAwarded || 0), 0);

      if (duplicatePoints === 0) continue; // no actual points awarded wrongly

      // Reduce user score
      const user = await User.findById(userId);
      if (!user) {
        console.warn(`❌ User ${userId} not found.`);
        continue;
      }

      const originalScore = user.score;
      user.score = Math.max(0, user.score - duplicatePoints);
      await user.save();

      console.log(`🛠️ Fixed User: ${user.username} (${userId})`);
      console.log(`   - Question: ${questionId}`);
      console.log(`   - Duplicate Corrects: ${entry.count}`);
      console.log(`   - Deducted Points: ${duplicatePoints}`);
      console.log(`   - Score: ${originalScore} → ${user.score}`);
    }

    console.log("\n✅ Score correction completed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during report and correction:", err);
    process.exit(1);
  }
}
