const RecentTask = require('../models/recentTaskModel');

exports.getAllRecentTasks = async (req, res) => {
    try {
        const tasks = await RecentTask.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createRecentTask = async (req, res) => {
    try {
        const task = new RecentTask(req.body);
        await task.save();
        res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateRecentTask = async (req, res) => {
    try {
        const task = await RecentTask.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteRecentTask = async (req, res) => {
    try {
        const task = await RecentTask.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};