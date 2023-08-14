const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    dueDate: Date,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
