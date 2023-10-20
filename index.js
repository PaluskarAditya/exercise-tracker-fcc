const express = require('express')
const app = express()
const cors = require('cors')
const { conn, User, Exercise, Log } = require('./db')
require('dotenv').config()

conn()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// POST -> create new user
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body
    const user = await new User({ username })
    user.save();
    res.json(user);
  } catch (error) {
    console.log(error.message);
  }
})

// GET -> get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
})

// POST -> post a new exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const { duration, date, description } = req.body;
    const id = req.params._id;
    const user = await User.findById(id);

    if (!user) {
      res.status(400).json({ error: "User not found" })
    }

    const exe = await new Exercise({
      user_id: user.id,
      username: user.username,
      description,
      duration,
      date: date ? new Date(date) : new Date()
    })
    exe.save();
    res.json(exe);
  } catch (error) {
    console.log(error.message);
  }
})

// GET -> get all users exercises
app.get('/api/users/:_id/exercises', async (req, res) => {
  try {
    const id = req.params._id
    const exercises = await Exercise.find({ user_id: id }).select("-user_id")

    if (!exercises) {
      res.status(400).json({ error: "No exercises found" })
    }

    res.json(exercises)
  } catch (error) {
    console.log(error.message)
  }
})

// GET -> get all user logs
app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const id = req.params._id;
    const user = await User.findById(id);
    const exercises = await Exercise.find({ user_id: id });
    const logs = exercises.map(el => ({
      date: el.date,
      duration: el.duration,
      description: el.description
    }))

    res.json({
      _id: user.id,
      count: exercises.length,
      username: user.username,
      log: logs
    })
  } catch (error) {
    console.log(error.message)
  }
})