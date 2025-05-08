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

// Get recent activities for admin dashboard
exports.getRecentActivities = async (req, res) => {
  try {
    const { limit = 10, page = 1, filter } = req.query;
    const skip = (page - 1) * limit;

    let query = { companyId: req.user.companyId || req.user._id };

    // Apply filters if provided
    if (filter) {
      if (filter.entityType) {
        query.entityType = filter.entityType;
      }
      if (filter.action) {
        query.action = filter.action;
      }
      if (filter.userId) {
        query.user = filter.userId;
      }
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName email')
      .lean();

    const total = await Activity.countDocuments(query);

    res.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// Get activity details
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

    // Check if user has access to this activity
    if (activity.companyId.toString() !== (req.user.companyId || req.user._id).toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
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

// Get Project Activities
exports.getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      entityType: 'project',
      entityId: projectId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName')
      .lean();

    const total = await Activity.countDocuments({
      entityType: 'project',
      entityId: projectId
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project activities',
      error: error.message
    });
  }
};

// Get User Activities
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      user: userId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName')
      .lean();

    const total = await Activity.countDocuments({
      user: userId
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user activities',
      error: error.message
    });
  }
};

// Get Task Activities
exports.getTaskActivities = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      entityType: 'task',
      entityId: taskId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName')
      .lean();

    const total = await Activity.countDocuments({
      entityType: 'task',
      entityId: taskId
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task activities',
      error: error.message
    });
  }
};

// Get Activity Statistics
exports.getActivityStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      companyId: req.user.companyId || req.user._id
    };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Activity.aggregate([
      { $match: query },
      { 
        $group: {
          _id: {
            entityType: "$entityType",
            action: "$action"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.entityType",
          actions: {
            $push: {
              action: "$_id.action",
              count: "$count"
            }
          },
          totalCount: { $sum: "$count" }
        }
      }
    ]);

    res.json({
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