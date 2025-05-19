const Task = require('../models/taskModel');
const { logActivity } = require('./activityController');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('project', 'name')
      .populate('assignedTo', 'firstName lastName email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.id,
      companyId: req.user.companyId || req.user._id
    });

    await task.save();

    // Log activity
    await logActivity(
      req,
      req.user,
      'create',
      'task',
      task._id,
      `Created new task: ${task.title}`,
      { after: req.body }
    );

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'firstName lastName email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldTask = { ...task.toObject() };
    Object.assign(task, req.body);
    await task.save();

    // Log activity
    await logActivity(
      req,
      req.user,
      'update',
      'task',
      task._id,
      `Updated task: ${task.title}`,
      {
        before: oldTask,
        after: task.toObject()
      }
    );

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Log activity before deleting
    await logActivity(
      req,
      req.user,
      'delete',
      'task',
      task._id,
      `Deleted task: ${task.title}`,
      { before: task.toObject() }
    );

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};