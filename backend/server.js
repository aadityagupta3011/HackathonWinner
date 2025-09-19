require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workout');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workout', workoutRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
  })
  .catch(err => console.error(err));
