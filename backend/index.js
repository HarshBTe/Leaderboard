const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://harshdubey:HarshD36%40@cluster0.gy1d4yp.mongodb.net/leaderboard?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));
  




// Define User Schema and Model

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    totalPoints: { type: Number, default: 0 }
  });
  const User = mongoose.model('User', userSchema);
  

// Define Claim History Schema and Model
const claimHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pointsClaimed: Number,
  timestamp: { type: Date, default: Date.now }
});
const ClaimHistory = mongoose.model('ClaimHistory', claimHistorySchema);


  

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API to get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// API to add a new user


  app.post('/users', async (req, res) => {
    try {
      const { name } = req.body;
      const newUser = new User({ name });
      await newUser.save();
      res.json(newUser);
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'Failed to save user' });
    }
  });
  
  

// API to claim points (random between 1 and 10)
app.post('/claim-points', async (req, res) => {
  const { userId } = req.body;
  const pointsClaimed = Math.floor(Math.random() * 10) + 1;

  // Update user's total points
  const user = await User.findById(userId);
  user.totalPoints += pointsClaimed;
  await user.save();

  // Add claim history entry
  const newHistory = new ClaimHistory({ userId, pointsClaimed });
  await newHistory.save();

  res.json({ user, pointsClaimed });
});

// API to get leaderboard (sorted by total points)
app.get('/leaderboard', async (req, res) => {
  const leaderboard = await User.find().sort({ totalPoints: -1 });
  res.json(leaderboard);
});

// API to get claim history
app.get('/history', async (req, res) => {
  const history = await ClaimHistory.find().populate('userId').sort({ timestamp: -1 });
  res.json(history);
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
