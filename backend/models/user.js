const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    name: String,
    age: Number,
    gender: String,
    height: Number, // cm
    weight: Number, // kg
    goal: String,
    periodCycle: {
      lastStartDate: Date,
      cycleLengthDays: Number
    },
    streak: { type: Number, default: 0 }
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
