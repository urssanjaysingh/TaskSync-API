const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

const projectController = {};

projectController.createProject = async (req, res) => {
    try {
        const { name, description, owner, members } = req.body;

        const newProject = new Project({
            name,
            description,
            owner,
            members
        });

        const savedProject = await newProject.save();
        return res.json(savedProject);
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

projectController.getProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId)
            .populate('owner', 'username') // Populate owner with selected fields
            .populate('members', 'username'); // Populate members with selected fields

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

projectController.updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { name, description, members } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                name,
                description,
                members
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

projectController.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

projectController.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('owner', 'username') // Populate owner with selected fields
            .populate('members', 'username'); // Populate members with selected fields

        return res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = projectController;
