const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assigned_to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        due_date: {
            type: Date,
            required: true
        },
        status: {
            type: [String], // Use an array of strings
            enum: ['Todo', 'In Progress', 'Completed'],
            default: ['Todo'], // Set a default value as an empty array or any other appropriate default
        },
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
