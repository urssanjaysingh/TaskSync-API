const mongoose = require('mongoose');

const taskSyncSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    syncDate: { type: Date, default: Date.now },
    syncStatus: { type: String, enum: ['synced', 'pending'], default: 'pending' }
});

const TaskSync = mongoose.model('TaskSync', taskSyncSchema);

module.exports = TaskSync;
