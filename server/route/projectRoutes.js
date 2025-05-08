const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');
const { protect } = require('../middleware/authMiddleware');

// Create a new project
router.post('/', protect, async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            createdBy: req.user.id,
            members: [req.user.id] // Add the creator as a member automatically
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all projects
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find(req.user.role === 'admin' 
            ? {} 
            : { members: req.user.id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific project
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a project
router.put('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a project
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a team member to a project
router.post('/:projectId/members/:userId', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Check if user is already a member
        if (project.members.includes(req.params.userId)) {
            return res.status(400).json({ message: 'User is already a team member' });
        }
        
        // Add member to project
        project.members.push(req.params.userId);
        await project.save();
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;