const mongoose = require('mongoose');

const conn = () => {
  mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB Connected')
}

const User = new mongoose.model('Users', {
  username: String,
})

const Exercise = new mongoose.model('Exercises', {
  username: String,
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  date: Date,
  duration: Number,
  description: String
})

const Log = new mongoose.model('Logs', {
  username: String,
  count: Number,
  log: {
    description: String,
    duration: Number,
    date: Date,
  }
})

module.exports = {
  conn,
  User,
  Exercise,
  Log,
}