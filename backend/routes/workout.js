const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// helper: compute BMI
function bmi(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  return weightKg / Math.pow(heightCm / 100, 2);
}

// simple rule-based plan generator
function generatePlan({ age, gender, height, weight, goal }) {
  const myBmi = bmi(weight, height);
  const plan = { summary: '', exercises: [] };

  if (!goal) goal = 'general fitness';

  if (goal.includes('weight') || (myBmi && myBmi > 25)) {
    plan.summary = 'Focus: fat loss — Cardio + HIIT';
    plan.exercises = [
      { name: 'Jumping Jacks', sets: 3, reps: '40 sec' },
      { name: 'Burpees', sets: 3, reps: '10-12' },
      { name: 'High Knees', sets: 3, reps: '30 sec' },
      { name: 'Plank', sets: 3, reps: '30-60 sec' },
    ];
  } else if (goal.includes('muscle') || (myBmi && myBmi < 18.5)) {
    plan.summary = 'Focus: muscle & strength — progressive resistance';
    plan.exercises = [
      { name: 'Push-ups', sets: 3, reps: '8-12' },
      { name: 'Bodyweight Squats', sets: 4, reps: '12-15' },
      { name: 'Lunges', sets: 3, reps: '10-12 each leg' },
      { name: 'Dumbbell Rows (or inverted rows)', sets: 3, reps: '8-12' },
    ];
  } else {
    plan.summary = 'General fitness — mix of cardio, strength & mobility';
    plan.exercises = [
      { name: 'Squats', sets: 3, reps: '12-15' },
      { name: 'Push-ups', sets: 3, reps: '10-15' },
      { name: 'Jump Rope', sets: 4, reps: '1 min' },
      { name: 'Plank', sets: 3, reps: '45 sec' },
    ];
  }

  return plan;
}

// public: generate plan by body data (no auth required optionally)
router.post('/generate', async (req, res) => {
  try {
    const { age, gender, height, weight, goal } = req.body;
    const plan = generatePlan({ age, gender, height, weight, goal });
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// secured: save profile & return plan
router.post('/profile-and-generate', auth, async (req, res) => {
  try {
    const { age, gender, height, weight, goal } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.profile = { ...user.profile, age, gender, height, weight, goal };
    await user.save();

    const plan = generatePlan({ age, gender, height, weight, goal });
    res.json({ plan, user: user.profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
