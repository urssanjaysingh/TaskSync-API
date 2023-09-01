const Task = require('../models/Task');

const taskController = {};

taskController.createTask = async (req, res) => {
    try {
        const { title, description, assigned_to, due_date, status } = req.body;

        const newTask = new Task({
            title,
            description,
            created_by: req.user.id, // Assuming you have an authentication middleware
            assigned_to,
            due_date,
            status
        });

        const savedTask = await newTask.save();
        return res.json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

taskController.getTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

taskController.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

taskController.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, assigned_to, due_date, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                title,
                description,
                assigned_to,
                due_date,
                status
            },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

taskController.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = taskController;
