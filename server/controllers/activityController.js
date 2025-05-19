const Activity = require('../models/activityModel');

// Log an activity
exports.logActivity = async (req, user, action, entityType, entityId, description, changes = null) => {
  try {
    const activity = new Activity({
      user: user.id,
      action,
      entityType,
      entityId,
      description,
      changes,
      companyId: user.companyId || user._id // if admin, use their ID as companyId
    });
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

// Get recent activities with pagination
exports.getRecentActivities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'firstName lastName email')
            .lean();

        const total = await Activity.countDocuments();
        const pages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: activities,
            pagination: {
                page,
                limit,
                total,
                pages
            }
        });
    } catch (error) {
        console.error('Error in getRecentActivities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching activities',
            error: error.message
        });
    }
};

// Get activity statistics
exports.getActivityStatistics = async (req, res) => {
    try {
        const stats = await Activity.aggregate([
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity statistics',
            error: error.message
        });
    }
};

// Get project-specific activities
exports.getProjectActivities = async (req, res) => {
    try {
        const activities = await Activity.find({
            entityType: 'project',
            entityId: req.params.projectId
        })
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName email')
        .lean();

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching project activities',
            error: error.message
        });
    }
};

// Get user-specific activities
exports.getUserActivities = async (req, res) => {
    try {
        const activities = await Activity.find({
            user: req.params.userId
        })
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName email')
        .lean();

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user activities',
            error: error.message
        });
    }
};

// Get task-specific activities
exports.getTaskActivities = async (req, res) => {
    try {
        const activities = await Activity.find({
            entityType: 'task',
            entityId: req.params.taskId
        })
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName email')
        .lean();

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching task activities',
            error: error.message
        });
    }
};

// Get specific activity details
exports.getActivityDetails = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .lean();

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: activity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity details',
            error: error.message
        });
    }
};