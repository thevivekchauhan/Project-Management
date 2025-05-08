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
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Store old values for activity log
    const previousValues = task.toObject();

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Log activity
    await logActivity(
      req,
      req.user,
      'update',
      'task',
      task._id,
      `Updated task: ${task.title}`,
      {
        before: previousValues,
        after: req.body
      }
    );

    res.json({
      success: true,
      data: updatedTask
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
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.remove();

    // Log activity
    await logActivity(
      req,
      req.user,
      'delete',
      'task',
      task._id,
      `Deleted task: ${task.title}`,
      { before: task.toObject() }
    );

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};