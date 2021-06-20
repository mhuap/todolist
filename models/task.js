const mongoose = require('mongoose');
const User = require('./user')

const TaskSchema = new mongoose.Schema({
  text: String,
  done: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  }
});

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task
