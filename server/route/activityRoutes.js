const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Get recent activities (paginated)
router.get('/recent', activityController.getRecentActivities);

// Get activity statistics
router.get('/statistics', activityController.getActivityStatistics);

// Get project-specific activities
router.get('/project/:projectId', activityController.getProjectActivities);

// Get user-specific activities
router.get('/user/:userId', activityController.getUserActivities);

// Get task-specific activities
router.get('/task/:taskId', activityController.getTaskActivities);

// Get specific activity details
router.get('/:id', activityController.getActivityDetails);

module.exports = router;