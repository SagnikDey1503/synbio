const mongoose = require('mongoose');
const Submission = require('./models/Submission');
const User = require('./models/User'); // Needed to fetch user details
require('dotenv').config();

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

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function runReports() {
  try {
    const duplicateCorrects = await Submission.aggregate([
      { $match: { isCorrect: true } },
      {
        $group: {
          _id: { userId: "$userId", questionId: "$questionId" },
          count: { $sum: 1 },
          timestamps: { $push: "$createdAt" }
        }
      },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]);

    if (duplicateCorrects.length === 0) {
      console.log("\n✅ No duplicate correct submissions found. All clean!");
      process.exit(0);
    }

    console.log(`\n⚠️ Duplicate Correct Submissions Found: ${duplicateCorrects.length}\n`);

    for (const entry of duplicateCorrects) {
      const { userId, questionId } = entry._id;
      const user = await User.findById(userId).lean();

      const displayName = user
        ? `${user.fullName} (${user.username})`
        : `Unknown User (${userId})`;

      console.log(`👤 ${displayName} | Question: ${questionId} | Correct Count: ${entry.count}`);
      entry.timestamps.forEach((ts, i) => {
        console.log(`   - ✅ Attempt ${i + 1} at ${new Date(ts).toLocaleString()}`);
      });
      console.log(); // extra spacing
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error in report generation:", err);
    process.exit(1);
  }
}
